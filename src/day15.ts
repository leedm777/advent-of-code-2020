import _ from "lodash";
// import { makeSideLogger } from "./aoc";

// const log = makeSideLogger("day15.log");

export function part1(input: number[], rounds = 2020): number {
  const history = _.reduce(
    input,
    (history, val, round) => {
      history.set(val, round);
      return history;
    },
    new Map<number, number>()
  );
  let next = 0;

  // const start = process.hrtime.bigint();
  // let lastLog = 0;
  for (let i = input.length; i < rounds - 1; ++i) {
    // const deltaSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    // if (deltaSeconds - lastLog > 1) {
    //   lastLog = deltaSeconds;
    //   log.clear();
    //   const percent = (i / rounds) * 100;
    //   log.log(`${percent.toFixed(1)} %; ${deltaSeconds.toFixed(3)} s`);
    // }

    const current = next;
    const lastSeen = history.get(current);
    next = 0;
    if (lastSeen != null) {
      next = i - lastSeen;
    }
    history.set(current, i);
  }

  return next;
}

export function part2(input: number[]): number {
  return part1(input, 30000000);
}
