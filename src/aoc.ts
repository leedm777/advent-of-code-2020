import _ from "lodash";
import fs from "fs";

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

  extract(): T {
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
