import { part1, part2 } from "./day02";
import { splitLines, readFile } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day02.txt"));

describe("day 2", () => {
  describe("part 1", () => {
    it.each([
      [["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"], 2],
      [puzzleInput, 582],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"], 1],
      [puzzleInput, 729],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
