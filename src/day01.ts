import _ from "lodash";

export function part1(input: string): number {
  const nums = _(input)
    .split(/\s+/)
    .map((s) => parseInt(s, 10))
    .value();

  const [num1, num2] = _(nums)
    .flatMap((num1) => _.map(nums, (num2) => [num1, num2]))
    .filter(([num1, num2]) => num1 + num2 === 2020)
    .head();

  return num1 * num2;
}

export function part2(input: string): number {
  const nums = _(input)
    .split(/\s+/)
    .map((s) => parseInt(s, 10))
    .value();

  const [num1, num2, num3] = _(nums)
    .flatMap((num1) => _.map(nums, (num2) => [num1, num2]))
    .flatMap(([num1, num2]) => _.map(nums, (num3) => [num1, num2, num3]))
    .filter(([num1, num2, num3]) => num1 + num2 + num3 === 2020)
    .head();

  return num1 * num2 * num3;
}
