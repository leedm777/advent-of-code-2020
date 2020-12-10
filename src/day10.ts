import _ from "lodash";
// import { SideLogger } from "./aoc";

function computeDeltas(input: number[]): number[] {
  input = _.concat(input, [0, (_.max(input) as number) + 3]);
  _.concat(input, [0, (_.max(input) as number) + 3]);
  const sorted = _.sortBy(input);
  const deltas = _(sorted)
    .zip(_.drop(sorted, 1))
    .filter(([, b]) => !_.isNil(b))
    .map(([a, b]: [number, number]): number => b - a)
    .value();

  // TODO: No idea why it things deltas are an array of booleans
  return (deltas as unknown) as number[];
}

export function part1(input: number[]): number {
  const deltas = computeDeltas(input);
  const groups = _.countBy(deltas);
  return groups["1"] * groups["3"];
}

// const log = new SideLogger("./day10.log");
// log.clear();

// TODO: I wonder if there's a better way other than memoizing...
const possibleCombinations = _.memoize((deltas: number[]): number => {
  // log.log(JSON.stringify(deltas));
  if (deltas.length <= 1) {
    return 1;
  }

  const sumFirstTwo = deltas[0] + deltas[1];
  if (sumFirstTwo <= 3) {
    // If the first two numbers can sum to less than three, then we could either
    // leave it, or drop it. Compute both possibilities.

    // log.log("SPLIT");
    return (
      possibleCombinations(_.drop(deltas, 1)) +
      possibleCombinations(_.concat([sumFirstTwo], _.drop(deltas, 2)))
    );
  }

  // We can't drop the first number, so just compute the possibilities for the
  // remaining numbers
  return possibleCombinations(_.drop(deltas, 1));
}, JSON.stringify);

export function part2(input: number[]): number {
  const deltas = computeDeltas(input);
  return possibleCombinations(deltas);
}
