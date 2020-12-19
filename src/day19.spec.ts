import { part1, part2 } from "./day19";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day19.txt"));

describe("day19", () => {
  describe("part 1", () => {
    it.each([
      [
        [
          "0: 4 1 5",
          "1: 2 3 | 3 2",
          "2: 4 4 | 5 5",
          "3: 4 5 | 5 4",
          '4: "a"',
          '5: "b"',
          "",
          "ababbb",
          "bababa",
          "abbbab",
          "aaabbb",
          "aaaabbb",
        ],
        2,
      ],
      [puzzleInput, 248],
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
