import { part1, part2, helperOfTheDay } from "./day13";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day13.txt"));

describe("day13", () => {
  describe("helperOfTheDay", () => {
    it.each([[[], 0]])("input %#", (input, expected) => {
      const actual = helperOfTheDay(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [["939", "7,13,x,x,59,x,31,19"], 295],
      [puzzleInput, 3385],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [["939", "7,13,x,x,59,x,31,19"], 1068781],
      [["", "17,x,13,19"], 3417],
      [["", "67,7,59,61"], 754018],
      [["", "67,x,7,59,61"], 779210],
      [["", "67,7,x,59,61"], 1261476],
      [["", "1789,37,47,1889"], 1202161486],
      // [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
