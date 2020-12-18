import { part1, part2, compute } from "./day18";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day18.txt"));

describe("day18", () => {
  describe("compute", () => {
    it.each([
      ["1 + 2 * 3 + 4 * 5 + 6", 71],
      ["2 * 3 + (4 * 5)", 26],
      ["5 + (8 * 3 + 9 + 3 * 4 * 3)", 437],
      ["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))", 12240],
      ["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2", 13632],
    ])("input %#", (input, expected) => {
      const actual = compute(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [["1 + 2 * 3 + 4 * 5 + 6", "2 * 3 + (4 * 5)"], 71 + 26],
      [puzzleInput, 5374004645253],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("compute2", () => {
    it.each([
      ["1 + 2 * 3 + 4 * 5 + 6", 231],
      ["1 + (2 * 3) + (4 * (5 + 6))", 51],
      ["2 * 3 + (4 * 5)", 46],
      ["5 + (8 * 3 + 9 + 3 * 4 * 3)", 1445],
      ["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))", 669060],
      ["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2", 23340],
    ])("input %#", (input, expected) => {
      const actual = compute2(input);
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
