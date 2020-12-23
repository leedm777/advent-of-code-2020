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

  // The crab selects a destination cup: the cup with a label equal to the
  // current cup's label minus one. If this would select one of the cups that
  // was just picked up, the crab will keep subtracting one until it finds a cup
  // that wasn't just picked up. If at any point in this process the value goes
  // below the lowest value on any cup's label, it wraps around to the highest
  // value on any cup's label instead.
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

interface Cup {
  label: number;
  next?: Cup;
}

interface CupGame {
  cups: Map<number, Cup>;
  current: Cup;
}

export function playCupGameFast({ cups, current }: CupGame): CupGame {
  // The crab picks up the three cups that are immediately clockwise of the
  // current cup. They are removed from the circle; cup spacing is adjusted as
  // necessary to maintain the circle.
  const cup1 = current.next as Cup;
  const cup2 = cup1.next as Cup;
  const cup3 = cup2.next as Cup;

  // The crab selects a destination cup: the cup with a label equal to the
  // current cup's label minus one. If this would select one of the cups that
  // was just picked up, the crab will keep subtracting one until it finds a cup
  // that wasn't just picked up. If at any point in this process the value goes
  // below the lowest value on any cup's label, it wraps around to the highest
  // value on any cup's label instead.
  // TODO...

  // The crab places the cups it just picked up so that they are immediately
  // clockwise of the destination cup. They keep the same order as when they
  // were picked up.
  // TODO...

  return {
    cups,
    current: current.next as Cup,
  };
}

export function part2(input: string): number {
  const numCups = 1000000;
  const numMoves = 10000000;
  let cupsArray = parseCups(input);
  cupsArray = [
    ...cupsArray,
    ..._.range((_.max(cupsArray) as number) + 1, numCups + 1),
  ];

  const cups = new Map<number, Cup>();
  const firstCup: Cup = {
    label: cupsArray[i],
  };
  let priorCup = firstCup;
  for (let i = 1; i < cupsArray.length; ++i) {
    const cup = {
      label: cupsArray[i],
    };
    priorCup.next = cup;
    priorCup = cup;
    cups.set(i, cup);
  }
  priorCup.next = firstCup;

  let lastLogged = process.hrtime.bigint();
  for (let i = 0; i < numMoves; ++i) {
    if (process.hrtime.bigint() - lastLogged > 1000000000n) {
      log.clear();
      log.log(`${i}`);
      lastLogged = process.hrtime.bigint();
    }
    cupsArray = playCupGame(cupsArray);
  }

  const idx = _.findIndex(cupsArray, (x) => x === 1);

  return cupsArray[idx + 1] * cupsArray[idx + 2];
}
