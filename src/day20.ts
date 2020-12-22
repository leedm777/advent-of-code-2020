import _ from "lodash";
import { sscanf } from "scanf";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day20.log", true);

type Code = [number, number, number, number];

interface Orientation {
  flipped: "none" | "vertically" | "horizontally";
  rotation: number;
  code: Code;
}

interface Tile {
  id: number;
  grid: string[];
  orientations: Orientation[];
}

interface Placement {
  id: number;
  orientation: Orientation;
}

interface Turn {
  nextPosition: [number, number];
  lengthSides: number;
  remainingTiles: Tile[];
  currentPlacements: Placement[][];
  grids: Map<number, string[]>;
}

export function encodeSide(side: string): number {
  return _.chain(side)
    .replace(/\./g, "0")
    .replace(/#/g, "1")
    .thru((s) => parseInt(s, 2))
    .value();
}

// rotates clockwise
function rotate([top, right, bottom, left]: Code): Code {
  return [reverseBits(left), top, reverseBits(right), bottom];
}

export function reverseBits(n: number): number {
  let r = 0;
  for (let i = 0; i < 10; ++i) {
    r = (r << 1) | (n & 1);
    n >>= 1;
  }
  return r;
}

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

function flipVertically([top, right, bottom, left]: Code): Code {
  return [bottom, reverseBits(right), top, reverseBits(left)];
}

export function parseTile([idLine, ...grid]: string[]): Tile {
  // TODO: sscanf types are wrong
  const id = (sscanf(idLine, "Tile %d:") as unknown) as number;

  const top = encodeSide(_.head(grid) as string);
  const bottom = encodeSide(_.last(grid) as string);
  const left = encodeSide(_(grid).map(_.first).join(""));
  const right = encodeSide(_(grid).map(_.last).join(""));

  const code: Code = [top, right, bottom, left];
  const orientations: Orientation[] = [];
  let c = code;
  for (let i = 0; i < 4; ++i) {
    orientations.push({
      code: c,
      rotation: i,
      flipped: "none",
    });
    c = rotate(c);
  }
  c = flipVertically(code);
  for (let i = 0; i < 4; ++i) {
    orientations.push({
      code: c,
      rotation: i,
      flipped: "vertically",
    });
    c = rotate(c);
  }

  return {
    id,
    grid,
    orientations,
  };
}

function tileFits(
  currentTiles: Placement[][],
  tile: Tile,
  [y, x]: [number, number]
): Orientation[] {
  let candidates = tile.orientations;
  // compare the edges with the existing tiles
  const top = _.get(currentTiles, [y - 1, x]);
  if (top) {
    candidates = _.filter(
      candidates,
      (c) => c.code[TOP] === top.orientation.code[BOTTOM]
    );
  }
  const right = _.get(currentTiles, [y, x + 1]);
  if (right) {
    candidates = _.filter(
      candidates,
      (c) => c.code[RIGHT] === right.orientation.code[LEFT]
    );
  }
  const bottom = _.get(currentTiles, [y + 1, x]);
  if (bottom) {
    candidates = _.filter(
      candidates,
      (c) => c.code[BOTTOM] === bottom.orientation.code[TOP]
    );
  }
  const left = _.get(currentTiles, [y, x - 1]);
  if (left) {
    candidates = _.filter(
      candidates,
      (c) => c.code[LEFT] === left.orientation.code[RIGHT]
    );
  }
  return candidates;
}

export function computeNextPosition(
  [y, x]: [number, number],
  length: number
): [number, number] {
  if (y < x) {
    if (y >= length) {
      throw new Error(`Invalid next position for [${y},${x}]`);
    }
    return [y + 1, x];
  }

  if (x > 0) {
    return [y, x - 1];
  }

  if (y >= length) {
    throw new Error(`Invalid next position for [${y},${x}]`);
  }
  return [0, y + 1];
}

let totalCandidates = 0;

function play(turn: Turn): Turn | null {
  // log.log(JSON.stringify(turn.nextPosition));
  if (_.isEmpty(turn.remainingTiles)) {
    return turn;
  }

  for (const tile of turn.remainingTiles) {
    // log.log(`tile ${tile.id}`);
    const candidates = tileFits(
      turn.currentPlacements,
      tile,
      turn.nextPosition
    );
    // log.log(`  candidates ${_.size(candidates)}`);

    totalCandidates += _.size(candidates);
    log.log(`${JSON.stringify(turn.nextPosition)}: ${totalCandidates}`);

    try {
      for (const candidate of candidates) {
        const nextTiles = [...turn.currentPlacements];
        nextTiles[turn.nextPosition[0]] = [...nextTiles[turn.nextPosition[0]]];
        _.set(nextTiles, turn.nextPosition, {
          id: tile.id,
          orientation: candidate,
        } as Placement);

        const nextTurn = play({
          ...turn,
          nextPosition: computeNextPosition(
            turn.nextPosition,
            turn.lengthSides
          ),
          remainingTiles: _.filter(
            turn.remainingTiles,
            ({ id }) => id !== tile.id
          ),
          currentPlacements: nextTiles,
        });

        if (nextTurn) {
          return nextTurn;
        }
      }
    } finally {
      totalCandidates -= _.size(candidates);
    }
  }

  return null;
}

function solve(input: string[]): Turn | null {
  const tiles = _(input)
    // TODO: need helper to chunk by blank lines
    .chunk(12)
    .map((c) => _.takeWhile(c, _.negate(_.isEmpty)))
    .map(parseTile)
    .value();

  const allTiles = _.reduce(
    tiles,
    (allTiles, tile) => {
      allTiles.set(tile.id, tile.grid);
      return allTiles;
    },
    new Map<number, string[]>()
  );

  const lengthSides = Math.sqrt(_.size(tiles));

  const currentPlacements: Placement[][] = [];
  for (let i = 0; i < _.size(tiles); ++i) {
    _.set(
      currentPlacements,
      [Math.floor(i / lengthSides), i % lengthSides],
      null
    );
  }

  return play({
    nextPosition: [0, 0],
    lengthSides,
    remainingTiles: tiles,
    currentPlacements,
    grids: allTiles,
  });
}

export function part1(input: string[]): number {
  const finalTurn = solve(input);

  if (!finalTurn) {
    return NaN;
  }

  const { lengthSides } = finalTurn;

  return (
    finalTurn.currentPlacements[0][0].id *
    finalTurn.currentPlacements[0][lengthSides - 1].id *
    finalTurn.currentPlacements[lengthSides - 1][0].id *
    finalTurn.currentPlacements[lengthSides - 1][lengthSides - 1].id
  );
}

const monster = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
];

export function part2(input: string[]): number {
  const finalTurn = solve(input);

  if (!finalTurn) {
    return NaN;
  }

  const { currentPlacements } = finalTurn;
  let finalGrid: string[][] = [];
  for (let y = 0; y < currentPlacements.length; ++y) {
    for (let x = 0; x < currentPlacements[y].length; ++x) {
      const { id, orientation } = currentPlacements[y][x];
      const { flipped, rotation } = orientation;
      let grid = finalTurn.grids.get(id);

      if (!grid) {
        throw new Error("Wat?");
      }

      if (flipped === "vertically") {
        grid = _.reverse(grid);
      }

      // trim the borders off the grid
      grid = _(grid)
        .drop()
        .dropRight()
        .map((s) => s.substr(1, s.length - 2))
        .value();

      for (let suby = 0; suby < grid.length; ++suby) {
        for (let subx = 0; subx < grid[suby].length; ++subx) {
          const oy = y * grid.length;
          const ox = x * grid[suby].length;
          const ey = oy + grid.length - 1;
          const ex = ox + grid[suby].length - 1;
          const v = grid[suby][subx];
          switch (rotation) {
            case 0:
              _.set(finalGrid, [oy + suby, ox + subx], v);
              break;
            case 1:
              _.set(finalGrid, [oy + subx, ex - suby], v);
              break;
            case 2:
              _.set(finalGrid, [ey - suby, ex - subx], v);
              break;
            case 3:
              _.set(finalGrid, [ey - subx, ox + suby], v);
              break;
            default:
              throw new Error("wat? " + rotation);
          }
        }
      }
    }
  }

  const monsterHash = [];
  const flippedMonsterHash = [];

  for (let y = 0; y < monster.length; ++y) {
    for (let x = 0; x < monster[y].length; ++x) {
      if (monster[y][x] === "#") {
        monsterHash.push([x, y]);
        flippedMonsterHash.push([x, monster.length - y]);
      }
    }
  }

  let monsterCount = 0;
  for (let rotation = 0; monsterCount === 0 && rotation < 4; ++rotation) {
    for (let y = 0; y < finalGrid.length - monster.length; ++y) {
      for (let x = 0; x < finalGrid[y].length - monster[0].length; ++x) {
        if (
          _.every(
            monsterHash,
            ([dx, dy]) => _.get(finalGrid, [y + dy, x + dx]) === "#"
          )
        ) {
          _.forEach(monsterHash, ([dx, dy]) =>
            _.set(finalGrid, [y + dy, x + dx], "O")
          );
          ++monsterCount;
        }

        if (
          _.every(
            flippedMonsterHash,
            ([dx, dy]) => _.get(finalGrid, [y + dy, x + dx]) === "#"
          )
        ) {
          _.forEach(flippedMonsterHash, ([dx, dy]) =>
            _.set(finalGrid, [y + dy, x + dx], "O")
          );
          ++monsterCount;
        }
      }
    }

    if (monsterCount === 0) {
      const nextGrid: string[][] = [];
      const end = finalGrid.length - 1;
      for (let ny = 0; ny < finalGrid.length; ++ny) {
        for (let nx = 0; nx < finalGrid[ny].length; ++nx) {
          _.set(nextGrid, [nx, end - ny], _.get(finalGrid, [ny, nx]));
        }
      }
      finalGrid = nextGrid;
    }
  }

  const hashCount = _(finalGrid)
    .map((row) => _.filter(row, (c) => c === "#"))
    .map(_.size)
    .sum();

  return hashCount;
}
