import _ from "lodash";

/**
 * Starting at the top-left corner of your map and following a slope of right 3
 * and down 1, how many trees would you encounter?
 */
export function part1(
  input: string[],
  [x, y] = [0, 0],
  numTrees = 0,
  slope = [3, 1]
): number {
  if (y >= input.length) {
    return numTrees;
  }

  const square = input[y][x % input[y].length];
  if (square === "#") {
    ++numTrees;
  }

  return part1(input, [x + slope[0], y + slope[1]], numTrees, slope);
}

/**
 * What do you get if you multiply together the number of trees encountered on
 * each of the listed slopes?
 */
export function part2(input: string[]): number {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  return _(slopes)
    .map((slope) => part1(input, [0, 0], 0, slope))
    .reduce(_.multiply, 1);
}
