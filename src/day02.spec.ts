import fs from "fs";
import { part1, part2 } from "./day02";

const puzzleInput = fs.readFileSync("./src/day02.txt", "utf-8").trim();

describe("day 2", () => {
  describe("part 1", () => {
    it.each([
      [``, 0],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [``, 0],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
