import fs from "fs";
import { part1, part2 } from "./day00";
import _ from "lodash";

const puzzleInput = _.trim(fs.readFileSync("./src/day00.txt", "utf-8"));

describe("day 00", () => {
  describe("part 1", () => {
    it.each([
      ["1122", 3],
      ["1111", 4],
      ["1234", 0],
      ["91212129", 9],
      [puzzleInput, 1044],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      ["1212", 6],
      ["1221", 0],
      ["123123", 12],
      ["12131415", 4],
      [puzzleInput, 1054],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
