import { part1, part2 } from "./day14";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day14.txt"));

describe("day14", () => {
  describe("part 1", () => {
    it.each([
      [
        [
          "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X",
          "mem[8] = 11",
          "mem[7] = 101",
          "mem[8] = 0",
        ],
        165n,
      ],
      [puzzleInput, 11884151942312n],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        [
          "mask = 000000000000000000000000000000X1001X",
          "mem[42] = 100",
          "mask = 00000000000000000000000000000000X0XX",
          "mem[26] = 1",
        ],
        208,
      ],
      [puzzleInput, 2625449018811],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
