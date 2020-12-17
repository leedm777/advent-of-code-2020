import _ from "lodash";

type Coord = [number, number, number];

const Active = "#";
const Inactive = ".";

export function parseLife(input: string[][]): Set<string> {
  const r = new Set<string>();
  _.forEach(input, (level, z) => {
    _.forEach(level, (row, y) => {
      _.forEach(row, (cell, x) => {
        if (cell === Active) {
          r.add(`${x},${y},${z}`);
        }
      });
    });
  });
  return r;
}

function getMinMax(board: Set<string>) {
  if (board.size === 0) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
    };
  }
  const { min, max } = _(board)
    .thru((set) => Array.from(set))
    .map((str) =>
      _(str)
        .split(",")
        .map((s) => parseInt(s, 10))
        .value()
    )
    .reduce(
      ({ min, max }, [x, y, z]) => {
        return {
          min: [Math.min(x, min[0]), Math.min(y, min[1]), Math.min(z, min[2])],
          max: [Math.max(x, max[0]), Math.max(y, max[1]), Math.max(z, max[2])],
        };
      },
      {
        min: [Infinity, Infinity, Infinity],
        max: [-Infinity, -Infinity, -Infinity],
      }
    );
  return { min, max };
}

export function renderLife(board: Set<string>): string[][] {
  const { min, max } = getMinMax(board);

  const r: string[][] = [];
  for (const z of _.range(min[2], max[2] + 1)) {
    for (const y of _.range(min[1], max[1] + 1)) {
      for (const x of _.range(min[0], max[0] + 1)) {
        const s = `${x},${y},${z}`;
        _.set(
          r,
          [z - min[2], y - min[1], x - min[0]],
          board.has(s) ? Active : Inactive
        );
      }
      r[z - min[2]][y - min[1]] = _.join(r[z - min[2]][y - min[1]], "");
    }
  }
  return r;
}

function countNeighbors(board: Set<string>, [x, y, z]: Coord): number {
  let count = 0;
  for (let dz = -1; dz <= 1; ++dz) {
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        if (!_.isEqual([dx, dy, dz], [0, 0, 0])) {
          if (board.has(`${x + dx},${y + dy},${z + dz}`)) {
            ++count;
          }
        }
      }
    }
  }
  return count;
}

export function iterateLife(board: Set<string>): Set<string> {
  const { min, max } = getMinMax(board);

  const r = new Set<string>();
  for (const z of _.range(min[2] - 1, max[2] + 2)) {
    for (const y of _.range(min[1] - 1, max[1] + 2)) {
      for (const x of _.range(min[0] - 1, max[0] + 2)) {
        const s = `${x},${y},${z}`;
        const numNeighbors = countNeighbors(board, [x, y, z]);
        if (board.has(s)) {
          if (numNeighbors === 2 || numNeighbors === 3) {
            r.add(s);
          }
        } else {
          if (numNeighbors === 3) {
            r.add(s);
          }
        }
      }
    }
  }

  return r;
}

export function part1(input: string[]): number {
  let board = parseLife([input]);
  for (let i = 0; i < 6; ++i) {
    board = iterateLife(board);
  }
  return board.size;
}

export function parseLife4d(input: string[][][]): Set<string> {
  const r = new Set<string>();
  _.forEach(input, (metaLevel, w) => {
    _.forEach(metaLevel, (level, z) => {
      _.forEach(level, (row, y) => {
        _.forEach(row, (cell, x) => {
          if (cell === Active) {
            r.add(`${x},${y},${z},${w}`);
          }
        });
      });
    });
  });
  return r;
}

function getMinMax4d(board: Set<string>) {
  if (board.size === 0) {
    return {
      min: [0, 0, 0, 0],
      max: [0, 0, 0, 0],
    };
  }
  const { min, max } = _(board)
    .thru((set) => Array.from(set))
    .map((str) =>
      _(str)
        .split(",")
        .map((s) => parseInt(s, 10))
        .value()
    )
    .reduce(
      ({ min, max }, [x, y, z, w]) => {
        return {
          min: [
            Math.min(x, min[0]),
            Math.min(y, min[1]),
            Math.min(z, min[2]),
            Math.min(w, min[3]),
          ],
          max: [
            Math.max(x, max[0]),
            Math.max(y, max[1]),
            Math.max(z, max[2]),
            Math.max(w, max[3]),
          ],
        };
      },
      {
        min: [Infinity, Infinity, Infinity, Infinity],
        max: [-Infinity, -Infinity, -Infinity, -Infinity],
      }
    );
  return { min, max };
}

type Coord4d = [number, number, number, number];

function countNeighbors4d(board: Set<string>, [x, y, z, w]: Coord4d): number {
  let count = 0;
  for (let dw = -1; dw <= 1; ++dw) {
    for (let dz = -1; dz <= 1; ++dz) {
      for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
          if (!_.isEqual([dx, dy, dz, dw], [0, 0, 0, 0])) {
            if (board.has(`${x + dx},${y + dy},${z + dz},${w + dw}`)) {
              ++count;
            }
          }
        }
      }
    }
  }
  return count;
}

export function iterateLife4d(board: Set<string>): Set<string> {
  const { min, max } = getMinMax4d(board);

  const r = new Set<string>();
  for (const w of _.range(min[3] - 1, max[3] + 2)) {
    for (const z of _.range(min[2] - 1, max[2] + 2)) {
      for (const y of _.range(min[1] - 1, max[1] + 2)) {
        for (const x of _.range(min[0] - 1, max[0] + 2)) {
          const s = `${x},${y},${z},${w}`;
          const numNeighbors = countNeighbors4d(board, [x, y, z, w]);
          if (board.has(s)) {
            if (numNeighbors === 2 || numNeighbors === 3) {
              r.add(s);
            }
          } else {
            if (numNeighbors === 3) {
              r.add(s);
            }
          }
        }
      }
    }
  }

  return r;
}

export function part2(input: string[]): number {
  let board = parseLife4d([[input]]);
  for (let i = 0; i < 6; ++i) {
    board = iterateLife4d(board);
  }
  return board.size;
}
