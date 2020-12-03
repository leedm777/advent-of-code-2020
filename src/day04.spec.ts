import { part1, part2 } from "./day04";
import { splitLines, readFile } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day04.txt"));

describe("day 4", () => {
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
