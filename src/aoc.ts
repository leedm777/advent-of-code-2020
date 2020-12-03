import _ from "lodash";
import fs from "fs";
import { Map } from "immutable";
import assert from "assert";

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
 * Read file as a UTF-8 string.
 *
 * @param name - Name of file to read.
 * @returns Contents of the file.
 */
export function readFile(name: string): string {
  return fs.readFileSync(name, "utf-8").trim();
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
  private map: string[];
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

  getNeighborDistance(): number {
    return 1;
  }
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
 * @param goal - Postion we want to get to
 * @param h - estimates the cost to reach goal from node n.
 */
export function findPath<P extends Position>(
  graph: Graph<P>,
  start: P,
  goal: P,
  h: Heuristic<P> = dijkstraHeuristic
): P[] {
  const open = new MinHeap<P>();
  open.insert(h(start), start);
  let cameFrom = Map<P, P>();

  // g(n) -> cost of the cheapest path from start to n currently known.
  let g = Map<P, number>();
  g = g.set(start, 0);

  let current = open.extract();
  while (current && !current.is(goal)) {
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
