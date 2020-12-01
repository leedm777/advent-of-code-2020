import _ from "lodash";

export function part1(input: number[]): number {
  const [num1, num2] =
    _(input)
      .flatMap((num1) => _.map(input, (num2) => [num1, num2]))
      .filter(([num1, num2]) => num1 + num2 === 2020)
      .head() || [];

  return num1 * num2;
}

export function part2(input: number[]): number {
  const [num1, num2, num3] =
    _(input)
      .flatMap((num1) => _.map(input, (num2) => [num1, num2]))
      .flatMap(([num1, num2]) => _.map(input, (num3) => [num1, num2, num3]))
      .filter(([num1, num2, num3]) => num1 + num2 + num3 === 2020)
      .head() || [];

  return num1 * num2 * num3;
}
