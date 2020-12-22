import { part1, part2 } from "./day22";
import { readFile, splitChunks, splitLines } from "./aoc";
import _ from "lodash";

const puzzleInput = _.map(splitChunks(readFile("./src/day22.txt")), splitLines);

describe("day22", () => {
  describe("part 1", () => {
    it.each([
      [
        [
          ["Player 1:", "9", "2", "6", "3", "1"],
          ["Player 2:", "5", "8", "4", "7", "10"],
        ],
        306,
      ],
      [puzzleInput, 33772],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        [
          ["Player 1:", "9", "2", "6", "3", "1"],
          ["Player 2:", "5", "8", "4", "7", "10"],
        ],
        291,
      ],
      [puzzleInput, 35070],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
