import { part1, part2 } from "./day03";
import { splitLines, readFile } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day03.txt"));

describe("day 3", () => {
  describe("part 1", () => {
    it.each([
      [[], 0],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [[], 0],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
