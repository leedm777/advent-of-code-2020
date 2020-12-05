import { part1, part2, computeSeatId } from "./day05";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day05.txt"));

describe("day 5", () => {
  describe("computeSeatId", () => {
    it.each([
      /*
      Here are some other boarding passes:
        BFFFBBFRRR: row 70, column 7, seat ID 567.
        FFFBBBFRRR: row 14, column 7, seat ID 119.
        BBFFBBFRLL: row 102, column 4, seat ID 820.
       */
      ["FBFBBFFRLR", 357],
      // FBFBBFF RLR
      // 0101100 101,
      ["BFFFBBFRRR", 567],
      ["FFFBBBFRRR", 119],
      ["BBFFBBFRLL", 820],
    ])("input %#", (input, expected) => {
      const actual = computeSeatId(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [[], undefined], // just figuring out why undefined is a possible response
      [["BFFFBBFRRR", "FFFBBBFRRR", "BBFFBBFRLL"], 820],
      [puzzleInput, 890],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([[puzzleInput, 651]])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
