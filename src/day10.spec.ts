import { part1, part2 } from "./day10";
import { readFile, splitNumbers } from "./aoc";

const puzzleInput = splitNumbers(readFile("./src/day10.txt"));

const largerExample = [
  28,
  33,
  18,
  42,
  31,
  14,
  46,
  20,
  48,
  47,
  24,
  23,
  49,
  45,
  19,
  38,
  39,
  11,
  1,
  32,
  25,
  35,
  8,
  17,
  7,
  9,
  4,
  2,
  34,
  10,
  3,
];

describe("day10", () => {
  describe("part 1", () => {
    it.each([
      [[16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4], 7 * 5],
      [largerExample, 22 * 10],
      [puzzleInput, 2048],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [[16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4], 8],
      [largerExample, 19208],
      [puzzleInput, 1322306994176],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
