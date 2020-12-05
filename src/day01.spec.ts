import fs from "fs";
import { part1, part2 } from "./day01";

import { splitNumbers } from "./aoc";

const puzzleInput = splitNumbers(fs.readFileSync("./src/day01.txt", "utf-8"));

describe("day 1", () => {
  describe("part 1", () => {
    it.each([
      [[1721, 979, 366, 299, 675, 1456], 514579],
      [[1010, 1721, 979, 366, 299, 675, 1456], 514579], // I should be glad they didn't do this
      [puzzleInput, 1019571],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [[1721, 979, 366, 299, 675, 1456], 241861950],
      [[1000, 20, 1721, 979, 366, 299, 675, 1456], 241861950], // I should be glad they didn't do this
      [puzzleInput, 100655544],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
