import _ from "lodash";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day23.log");

export function parseCups(s: string): number[] {
  return _(s)
    .split("")
    .map((s) => parseInt(s, 10))
    .value();
}

export function playCupGame(cups: number[]): number[] {
  // The crab picks up the three cups that are immediately clockwise of the
  // current cup. They are removed from the circle; cup spacing is adjusted as
  // necessary to maintain the circle.
  const [current, n1, n2, n3, ...rest] = cups;

  let destination = current - 1;
  let idx = _.findIndex(rest, (x) => x === destination);
  while (idx === -1) {
    if (destination === current) {
      throw new Error("Wat?");
    }
    destination = destination < 1 ? (_.max(rest) as number) : destination - 1;
    idx = _.findIndex(rest, (x) => x === destination);
  }
  ++idx;

  return [..._.slice(rest, 0, idx), n1, n2, n3, ..._.slice(rest, idx), current];
}

export function part1(input: string): string {
  let cups = parseCups(input);
  for (let i = 0; i < 100; ++i) {
    cups = playCupGame(cups);
  }

  const idx = _.findIndex(cups, (x) => x === 1);
  const cupsFromOne =
    idx === 0
      ? _.slice(cups, 1)
      : [..._.slice(cups, idx + 1), ..._.slice(cups, 0, idx)];
  return _.join(cupsFromOne, "");
}

export function part2(input: string): number {
  const numCups = 1000000;
  const numMoves = 10000000;
  let cups = parseCups(input);
  cups = [...cups, ..._.range((_.max(cups) as number) + 1, numCups + 1)];
  let lastLogged = process.hrtime.bigint();
  for (let i = 0; i < numMoves; ++i) {
    if (process.hrtime.bigint() - lastLogged > 1000000000n) {
      log.clear();
      log.log(`${i}`);
      lastLogged = process.hrtime.bigint();
    }
    cups = playCupGame(cups);
  }

  const idx = _.findIndex(cups, (x) => x === 1);

  return cups[idx + 1] * cups[idx + 2];
}
