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

export interface Graph {
  getNeighbors(p: Position): Position[];

  getDistance(start: Position, neighbor: Position): number;
}

function dijkstraHeuristic(): number {
  return 0;
}

// hacked implementation of A* from the Wikipedia algo
// see https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
//
// f(n) -> current best guess as to how short a path from start to finish can
//         be if it goes through n
// g(n) -> cost of the cheapest path from start to n currently known.
// h(n) -> estimates the cost to reach goal from node n.
export function shortestPath(
  graph: Graph,
  start: Position,
  goal: Position,
  h: (p: Position) => number = dijkstraHeuristic
): Position[] {
  const open = new MinHeap<Position>();
  open.insert(h(start), start);
  let cameFrom = Map<Position, Position>();

  let g = Map<Position, number>();
  g = g.set(start, 0);

  let current = open.extract();
  while (current && !current.is(goal)) {
    for (const neighbor of graph.getNeighbors(current)) {
      const cost =
        g.get(current, Infinity) + graph.getDistance(current, neighbor);
      assert(cost < Infinity, `Should have code for node ${current}`);
      if (cost < g.get(neighbor, Infinity)) {
        cameFrom = cameFrom.set(neighbor, current);
        g = g.set(neighbor, cost);
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
