import _ from "lodash";

export function part1(
  input: number[],
  n = 2,
  target = 2020
): number | undefined {
  // If we've run out of input, there is no match
  if (_.isEmpty(input)) {
    return undefined;
  }

  // If we're looking for a single number, just find it in the input
  if (n === 1) {
    if (_.includes(input, target)) {
      return target;
    }
    return undefined;
  }

  // We're looking for n numbers whose sum is target. Since all numbers are
  // positive, we can optimize a bit.
  return (
    _(input)
      // filter out any numbers that are too large
      .filter((num) => num < target)
      // For `num` to be a solution for `target`, the remaining array has to be
      // a solution for `target - num`.
      .map((num, idx) => {
        const rem = _.drop(input, idx + 1);
        const product = part1(rem, n - 1, target - num);
        return product && product * num;
      })
      // and find the first solution
      .find((num) => !_.isNil(num))
  );
}

export function part2(input: number[]): number | undefined {
  return part1(input, 3);
}
