import { part1 } from "./day25";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day25.txt"));

describe("day25", () => {
  describe("part 1", () => {
    it.each([
      [["5764801", "17807724"], 14897079],
      [puzzleInput, 15217943],
    ])("input %#", (input, expected) => {
      const actual = part1(input as [string, string]);
      expect(actual).toStrictEqual(expected);
    });
  });
});
