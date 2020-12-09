import _ from "lodash";
import fs from "fs";
import { Map } from "immutable";
import assert from "assert";
import { EventEmitter } from "events";
import * as util from "util";

/**
 * Since the unit test framework makes it hard to use stdout/stderr, use
 * SideLogger to log output to a file. You can use `tail +1f` to tail the log
 * to see the output in realtime.
 */
export class SideLogger {
  private readonly fd: number;

  constructor(filename: string) {
    this.fd = fs.openSync(filename, "w");
  }

  /**
   * Clear the screen.
   */
  clear(): void {
    fs.writeSync(this.fd, "\x1B[H\x1B[J");
  }

  /**
   * Move cursor back to home.
   */
  home(): void {
    fs.writeSync(this.fd, "\x1B[H");
  }

  /**
   * Log a string, much like `console.log()`.
   * @param str - String to log, or format.
   * @param args - Args for the format string.
   */
  log(str = "", ...args: unknown[]): void {
    str = util.format(str, ...args);
    fs.writeSync(this.fd, `${str}\n`);
  }

  /**
   * Write string without formatting, or ending newline.
   * @param str - String to log.
   */
  puts(str: string): void {
    fs.writeSync(this.fd, str);
  }
}

/**
 * Split a string into an array of numbers.
 *
 * @param str - String to parse.
 * @returns parsed numbers
 */
export function splitNumbers(str: string): number[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _(str)
    .split(/\s+/)
    .map((s) => parseInt(s, 10))
    .value();
}

/**
 * Split a string into its lines.
 *
 * @param str - String to split.
 * @returns Array of strings for the lines in `str`.
 */
export function splitLines(str: string): string[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _.split(str, "\n");
}

/**
 * Split a string into chunks separated by blank lines.
 * @param str - String to split.
 * @returns Array of chunks from the string.
 */
export function splitChunks(str: string): string[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _.split(str, "\n\n");
}

/**
 * Split a string into words.
 *
 * @param str - String to split.
 * @returns Array of works from the string.
 */
export function splitWords(str: string): string[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _.split(str, /\s+/);
}

/**
 * Split a string into characters.
 *
 * @param str - String to split.
 * @returns Array of characters from the string.
 */
export function splitCharacters(str: string): string[] {
  return _.split(str, "");
}

/**
 * Read file as a UTF-8 string.
 *
 * @param name - Name of file to read.
 * @returns Contents of the file.
 */
export function readFile(name: string): string {
  return _.trim(fs.readFileSync(name, "utf-8"));
}

type HeapNode<T> = { priority: number; node: T };

export class MinHeap<T> {
  heap: HeapNode<T>[];

  constructor() {
    // null element helps with the off by one errors
    this.heap = [];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  insert(priority: number, node: T): void {
    this.heap.push({
      priority,
      node,
    });

    let i = this.heap.length - 1;
    let p = Math.floor((i - 1) / 2);

    while (i > 0 && this.priority(i) < this.priority(p)) {
      this.swap(i, p);

      i = p;
      p = Math.floor((i - 1) / 2);
    }
  }

  extract(): T | undefined {
    if (this.isEmpty()) {
      return;
    }

    const r = this.heap[0];
    if (this.heap.length <= 1) {
      this.heap = [];
      return r.node;
    }

    this.heap[0] = this.heap.pop() as HeapNode<T>;

    let i = 0;
    let c1 = 1;
    let c2 = 2;

    while (
      this.priority(i) > this.priority(c1) ||
      this.priority(i) > this.priority(c2)
    ) {
      if (this.priority(c1) < this.priority(c2)) {
        this.swap(i, c1);
        i = c1;
      } else {
        this.swap(i, c2);
        i = c2;
      }

      c1 = 2 * i + 1;
      c2 = 2 * i + 2;
    }

    return r.node;
  }

  swap(i1: number, i2: number): void {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  priority(i: number): number {
    return _.get(this.heap, i, { priority: Infinity }).priority;
  }
}

export interface Position {
  is(other: Position): boolean;
}

export interface Graph<T extends Position> {
  getNeighbors(p: T): T[];

  getNeighborDistance(start: T, neighbor: T): number;
}

export class XYPosition implements Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  is(other: XYPosition): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `[ ${this.x}, ${this.y} ]`;
  }
}

/**
 * Shorthand for creating XYPositions. No idea if the memoize helps or not.
 */
export const xy = _.memoize(
  (x, y) => new XYPosition(x, y),
  (x, y) => `${x},${y}`
);

const moves = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export class TextGraph implements Graph<XYPosition> {
  readonly map: string[];
  private open: string;
  private wall: string;

  constructor(map: string[], open = ".", wall = "#") {
    this.map = map;
    this.open = open;
    this.wall = wall;
  }

  getNeighbors(p: XYPosition): XYPosition[] {
    return _(moves)
      .map((move) => xy(p.x + move[0], p.y + move[1]))
      .filter(
        (n) =>
          _.inRange(n.x, 0, this.map[0].length) &&
          _.inRange(n.y, 0, this.map.length) &&
          this.map[n.y][n.x] === this.open
      )
      .value();
  }

  getNeighborDistance = _.constant(1);
}

type Heuristic<P extends Position> = (p: P) => number;

function dijkstraHeuristic(): number {
  return 0;
}

export function manhattanHeuristic(goal: XYPosition): Heuristic<XYPosition> {
  return (p: XYPosition) => Math.abs(goal.x - p.x) + Math.abs(goal.y + p.y);
}

/**
 * Implementation of A* from the Wikipedia algo
 * see [](https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode)
 *
 * @param graph - Graph of maze positions.
 * @param start - Position we are starting from
 * @param goal - Position we want to get to
 * @param h - estimates the cost to reach goal from node n.
 * @param emitter - emitter to get graph updates
 */
export function findPath<P extends Position>({
  graph,
  start,
  goal,
  h = dijkstraHeuristic,
  emitter = new EventEmitter(),
}: {
  graph: Graph<P>;
  start: P;
  goal: P;
  h?: Heuristic<P>;
  emitter?: EventEmitter;
}): P[] {
  const open = new MinHeap<P>();
  open.insert(h(start), start);
  let cameFrom = Map<P, P>();

  // g(n) -> cost of the cheapest path from start to n currently known.
  let g = Map<P, number>();
  g = g.set(start, 0);

  let current = open.extract();
  while (current && !current.is(goal)) {
    emitter.emit("visit", current, _.map(open.heap, "node"), g.keys());
    for (const neighbor of graph.getNeighbors(current)) {
      const cost =
        g.get(current, Infinity) + graph.getNeighborDistance(current, neighbor);
      assert(cost < Infinity, `Should have cost for node ${current}`);
      if (cost < g.get(neighbor, Infinity)) {
        cameFrom = cameFrom.set(neighbor, current);
        g = g.set(neighbor, cost);
        // f(n) -> current best guess as to how short a path from start to
        // finish can be if it goes through n
        const f = cost + h(neighbor);
        open.insert(f, neighbor);
      }
    }

    current = open.extract();
  }

  // walk back to the beginning to record the path
  const path = [];
  while (current) {
    path.unshift(current);
    current = cameFrom.get(current);
  }

  return path;
}

export function findNumbersThatSum(
  numbers: number[],
  target: number,
  n = 2
): number[] | undefined {
  // console.log(`findNumbersThatSum(${JSON.stringify(numbers)}, ${target}, ${n})`);
  // If we've run out of input, there is no match
  if (_.isEmpty(numbers)) {
    return undefined;
  }

  // If we're looking for a single number, just find it in the numbers
  if (n === 1) {
    // console.log(`  single number ${target}`);
    if (_.includes(numbers, target)) {
      // console.log(`    found it`);
      return [target];
    }
    return undefined;
  }

  // We're looking for n numbers whose sum is target. Since all numbers are
  // positive, we can optimize a bit.
  return (
    _(numbers)
      // filter out any numbers that are too large
      .filter((num) => num < target)
      // For `num` to be a solution for `target`, the remaining array has to be
      // a solution for `target - num`.
      .map((num, idx) => {
        // console.log(`Finding answer for ${num}`);
        const restOfNumbers = _.drop(numbers, idx + 1);
        const restOfAnswer = findNumbersThatSum(
          restOfNumbers,
          target - num,
          n - 1
        );
        return restOfAnswer && [...restOfAnswer, num];
      })
      // and find the first solution
      .find((num) => !_.isNil(num))
  );
}
