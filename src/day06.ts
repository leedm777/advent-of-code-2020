import _ from "lodash";
import { splitLines } from "./aoc";

export function countUnionAnswers(input: string): number {
  return _(input)
    .filter((s) => /[a-z]/.test(s))
    .uniq()
    .size();
}

export function part1(input: string[]): number {
  return _(input).map(countUnionAnswers).sum();
}

export function countIntersectionAnswers(input: string): number {
  const answers = _(input)
    .thru(splitLines)
    .map((s) => _.split(s, ""))
    .value();
  const commonAnswers = _.intersection(...answers);
  return commonAnswers.length;
}

export function part2(input: string[]): number {
  return _(input).map(countIntersectionAnswers).sum();
}
