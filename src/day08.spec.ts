import { part1, part2 } from "./day08";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day08.txt"));

describe("day08", () => {
  describe("part 1", () => {
    it.each([
      [
        [
          "nop +0",
          "acc +1",
          "jmp +4",
          "acc +3",
          "jmp -3",
          "acc -99",
          "acc +1",
          "jmp -4",
          "acc +6",
        ],
        5,
      ],
      [puzzleInput, 1727],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        [
          "nop +0",
          "acc +1",
          "jmp +4",
          "acc +3",
          "jmp -3",
          "acc -99",
          "acc +1",
          "jmp -4",
          "acc +6",
        ],
        8,
      ],
      [puzzleInput, 552],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
