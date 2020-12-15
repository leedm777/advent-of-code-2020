import _ from "lodash";
import { makeSideLogger } from "./aoc";

interface Game {
  roundsPlayed: number;
  seq: number[];
  startingNumbers: number[];
}

export function playRound({ roundsPlayed, seq, startingNumbers }: Game): Game {
  if (!_.isEmpty(startingNumbers)) {
    const [next, ...nextStarting] = startingNumbers;
    return {
      roundsPlayed: roundsPlayed + 1,
      seq: _.concat(seq, [next]),
      startingNumbers: nextStarting,
    };
  }

  const last = _.last(seq) as number;
  const prior = _.findLastIndex(seq, (n) => n === last, _.size(seq) - 2);
  let next = 0;
  if (prior !== -1) {
    next = roundsPlayed - prior - 1;
  }

  return {
    roundsPlayed: roundsPlayed + 1,
    seq: _.concat(seq, [next]),
    startingNumbers,
  };
}

const log = makeSideLogger("day15.log");

export function part1(input: number[], rounds = 2020): number {
  let game = {
    roundsPlayed: 0,
    seq: [],
    startingNumbers: input,
  } as Game;
  const start = process.hrtime.bigint();
  let lastLog = 0;
  while (game.roundsPlayed !== rounds) {
    const deltaSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    if (deltaSeconds - lastLog > 1) {
      lastLog = deltaSeconds;
      const rate = game.roundsPlayed / deltaSeconds;
      log.clear();
      log.log(`ETA: ${(rounds - game.roundsPlayed) / rate} s`);
    }
    game = playRound(game);
  }
  return _.last(game.seq) || NaN;
}

export function part2(input: number[]): number {
  return part1(input, 30000000);
}
