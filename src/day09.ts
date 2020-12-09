import _ from "lodash";
import { findNumbersThatSum, findSliceThatSum } from "./aoc";

/*
 * XMAS starts by transmitting a preamble of 25 numbers. After that, each number
 * you receive should be the sum of any two of the 25 immediately previous
 * numbers. The two numbers will have different values, and there might be more
 * than one such pair.
 */

/*
 * The first step of attacking the weakness in the XMAS data is to find the
 * first number in the list (after the preamble) which is not the sum of two of
 * the 25 numbers before it. What is the first number that does not have this
 * property?
 */
export function part1({
  preamble = 25,
  seq,
}: {
  preamble: number;
  seq: number[];
}): number {
  const candidates = _.take(seq, preamble);
  const codes = _.drop(seq, preamble);

  while (!_.isEmpty(codes)) {
    const next = codes.shift() as number;
    if (!findNumbersThatSum(candidates, next)) {
      return next;
    }

    candidates.push(next);
    candidates.shift();
  }
  return NaN;
}

export function part2({
  preamble = 25,
  seq,
}: {
  preamble: number;
  seq: number[];
}): number {
  const invalidNumber = part1({ preamble, seq });
  const slice = findSliceThatSum(seq, invalidNumber);
  if (_.isEmpty(slice)) {
    return NaN;
  }
  return (_.min(slice) as number) + (_.max(slice) as number);
}
