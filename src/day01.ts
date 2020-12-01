import _ from "lodash";
import "lodash.combinations";

export function part1(input: number[], n = 2): number {
  return (
    _(input)
      .combinations(n)
      .filter((nums) => _.sum(nums) === 2020)
      .map((nums) => _.reduce(nums, _.multiply))
      .head() || NaN
  );
}

export function part2(input: number[]): number {
  return part1(input, 3);
}
