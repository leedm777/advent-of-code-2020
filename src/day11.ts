import _ from "lodash";
import { SideLogger } from "./aoc";

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function getNeighbors({
  seating,
  x,
  y,
}: {
  seating: string[];
  x: number;
  y: number;
}): string[] {
  return [
    seating[y - 1] && seating[y - 1][x - 1],
    seating[y] && seating[y][x - 1],
    seating[y + 1] && seating[y + 1][x - 1],
    seating[y - 1] && seating[y - 1][x],
    seating[y + 1] && seating[y + 1][x],
    seating[y - 1] && seating[y - 1][x + 1],
    seating[y] && seating[y][x + 1],
    seating[y + 1] && seating[y + 1][x + 1],
  ];
}

/*
 * - If a seat is empty (L) and there are no occupied seats adjacent to it,
 *   the seat becomes occupied.
 * - If a seat is occupied (#) and four or more seats adjacent to it are also
 *   occupied, the seat becomes empty.
 * - Otherwise, the seat's state does not change.
 */
export function nextSeating(seating: string[]): string[] {
  const next = [];
  for (let y = 0; y < seating.length; ++y) {
    let row = "";
    for (let x = 0; x < seating[y].length; ++x) {
      const seat = seating[y][x];
      const neighbors = getNeighbors({ seating, x, y });
      switch (seat) {
        case "L":
          row += _.every(neighbors, (n) => n !== "#") ? "#" : "L";
          break;
        case "#":
          row +=
            _(neighbors)
              .filter((n) => n === "#")
              .size() >= 4
              ? "L"
              : "#";
          break;
        default:
          row += seat;
          break;
      }
    }
    next.push(row);
  }
  return next;
}

const log = new SideLogger("day11.log");
log.clear();

export function part1(input: string[]): number {
  let current = input;
  let next = nextSeating(current);
  while (!_.isEqual(current, next)) {
    // log.log(_.join(current, "\n"));
    current = next;
    next = nextSeating(current);
  }

  const counts = _.chain(current).join("\n").countBy().value();
  // log.log(JSON.stringify(counts, null, 2));
  return counts["#"];
}

/*
 * Now, instead of considering just the eight immediately adjacent seats,
 * consider the first seat in each of those eight directions.
 */
// OLD IMPLEMENTATION
// function getNeighborsPartTwo({
//   seating,
//   x,
//   y,
// }: {
//   seating: string[];
//   x: number;
//   y: number;
// }) {
//   const neighbors = [];
//   for (const [dy, dx] of directions) {
//     let px = x + dx;
//     let py = y + dy;
//
//     // log.log(`(${x}, ${y})`);
//     let seat;
//     while ((seat = _.get(seating, [py, px])) === ".") {
//       px += dx;
//       py += dy;
//     }
//
//     // log.log(`  (${px}, ${px}) = ${seat}`);
//
//     neighbors.push(seat);
//   }
//   return neighbors;
// }

interface Coord {
  x: number;
  y: number;
}

export function buildNeighborMap(seating: string[]): Coord[][][] {
  const map: Coord[][][] = [];
  for (let y = 0; y < seating.length; ++y) {
    const row: Coord[][] = [];
    map.push(row);
    for (let x = 0; x < seating[y].length; ++x) {
      const neighbors: Coord[] = [];
      for (const [dy, dx] of directions) {
        let px = x + dx;
        let py = y + dy;

        // log.log(`(${x}, ${y})`);
        let seat;
        while ((seat = seating[py] && seating[py][px]) === ".") {
          px += dx;
          py += dy;
        }
        // log.log(`  (${px}, ${px}) = ${seat}`);

        if (!_.isNil(seat)) {
          neighbors.push({ x: px, y: py });
        }
      }
      row.push(neighbors);
    }
  }

  return map;
}

/*
 * Also, people seem to be more tolerant than you expected: it now takes five or
 * more visible occupied seats for an occupied seat to become empty (rather than
 * four or more from the previous rules). The other rules still apply: empty
 * seats that see no occupied seats become occupied, seats matching no rule
 * don't change, and floor never changes.
 */
export function nextSeatingPartTwo(
  seating: string[],
  map: Coord[][][]
): string[] {
  const next = [];
  for (let y = 0; y < seating.length; ++y) {
    let row = "";
    for (let x = 0; x < seating[y].length; ++x) {
      const seat = seating[y][x];
      // const neighbors = getNeighborsPartTwo({ seating, x, y });
      const neighbors = _.map(map[y][x], ({ x: nx, y: ny }) => seating[ny][nx]);
      // log.log(JSON.stringify(neighbors, null, 2));
      switch (seat) {
        case "L":
          row += _.every(neighbors, (n) => n !== "#") ? "#" : "L";
          break;
        case "#":
          row +=
            _(neighbors)
              .filter((n) => n === "#")
              .size() >= 5
              ? "L"
              : "#";
          break;
        default:
          row += seat;
          break;
      }
    }
    next.push(row);
  }
  return next;
}

export function part2(input: string[]): number {
  const map = buildNeighborMap(input);
  let current = input;
  let next = nextSeatingPartTwo(current, map);
  while (!_.isEqual(current, next)) {
    log.log(_.join(current, "\n"));
    current = next;
    next = nextSeatingPartTwo(current, map);
  }

  const counts = _.chain(current).join("\n").countBy().value();
  // log.log(JSON.stringify(counts, null, 2));
  return counts["#"];
}
