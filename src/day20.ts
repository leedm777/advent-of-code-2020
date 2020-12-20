import _ from "lodash";
import { sscanf } from "scanf";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day20.log", true);

type Code = [number, number, number, number];

interface Tile {
  id: number;
  grid: string[];
  codes: Code[];
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

function flipHorizontally([top, right, bottom, left]: Code): Code {
  return [reverseBits(top), left, reverseBits(bottom), right];
}

function flipBoth(code: Code): Code {
  return flipHorizontally(flipVertically(code));
}

export function parseTile([idLine, ...grid]: string[]): Tile {
  // TODO: sscanf types are wrong
  const id = (sscanf(idLine, "Tile %d:") as unknown) as number;

  const top = encodeSide(_.head(grid) as string);
  const bottom = encodeSide(_.last(grid) as string);
  const left = encodeSide(_(grid).map(_.first).join(""));
  const right = encodeSide(_(grid).map(_.last).join(""));

  const code: Code = [top, right, bottom, left];
  const codes: Code[] = [];
  let c = code;
  for (let i = 0; i < 4; ++i) {
    codes.push(c);
    c = rotate(c);
  }
  c = flipVertically(code);
  for (let i = 0; i < 4; ++i) {
    codes.push(c);
    c = rotate(c);
  }
  c = flipHorizontally(code);
  for (let i = 0; i < 4; ++i) {
    codes.push(c);
    c = rotate(c);
  }
  c = flipBoth(code);
  for (let i = 0; i < 4; ++i) {
    codes.push(c);
    c = rotate(c);
  }

  return {
    id,
    grid,
    codes,
  };
}

interface Placement {
  id: number;
  code: Code;
}

interface Turn {
  nextPosition: [number, number];
  lengthSides: number;
  remainingTiles: Tile[];
  currentPlacements: Placement[][];
}

function tileFits(
  currentTiles: Placement[][],
  tile: Tile,
  [y, x]: [number, number]
): Code[] {
  let candidates = tile.codes;
  // compare the edges with the existing tiles
  const top = _.get(currentTiles, [y - 1, x]);
  if (top) {
    candidates = _.filter(candidates, (code) => code[TOP] === top.code[BOTTOM]);
  }
  const right = _.get(currentTiles, [y, x + 1]);
  if (right) {
    candidates = _.filter(
      candidates,
      (code) => code[RIGHT] === right.code[LEFT]
    );
  }
  const bottom = _.get(currentTiles, [y + 1, x]);
  if (bottom) {
    candidates = _.filter(
      candidates,
      (code) => code[BOTTOM] === bottom.code[TOP]
    );
  }
  const left = _.get(currentTiles, [y, x - 1]);
  if (left) {
    candidates = _.filter(
      candidates,
      (code) => code[LEFT] === left.code[RIGHT]
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
          code: candidate,
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

export function part1(input: string[]): number {
  const tiles = _(input)
    .chunk(12)
    .map((c) => _.takeWhile(c, _.negate(_.isEmpty)))
    .map(parseTile)
    .value();

  const lengthSides = Math.sqrt(_.size(tiles));

  const currentPlacements: Placement[][] = [];
  for (let i = 0; i < _.size(tiles); ++i) {
    _.set(
      currentPlacements,
      [Math.floor(i / lengthSides), i % lengthSides],
      null
    );
  }

  const finalTurn = play({
    nextPosition: [0, 0],
    lengthSides,
    remainingTiles: tiles,
    currentPlacements,
  });

  if (!finalTurn) {
    return NaN;
  }

  return (
    finalTurn.currentPlacements[0][0].id *
    finalTurn.currentPlacements[0][lengthSides - 1].id *
    finalTurn.currentPlacements[lengthSides - 1][0].id *
    finalTurn.currentPlacements[lengthSides - 1][lengthSides - 1].id
  );
}

export function part2(input: string[]): number {
  return 0;
}
