import { part1, part2 } from "./day09";
import { readFile, splitNumbers } from "./aoc";
import _ from "lodash";

const puzzleInput = splitNumbers(readFile("./src/day09.txt"));

describe("day09", () => {
  describe("part 1", () => {
    it.each([
      [
        {
          preamble: 25,
          seq: [..._.range(1, 26), 26, 49, 100, 50],
        },
        100,
      ],
      [
        {
          preamble: 5,
          seq: [
            35,
            20,
            15,
            25,
            47,
            40,
            62,
            55,
            65,
            95,
            102,
            117,
            150,
            182,
            127,
            219,
            299,
            277,
            309,
            576,
          ],
        },
        127,
      ],
      [{ preamble: 25, seq: puzzleInput }, 3199139634],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        {
          preamble: 5,
          seq: [
            35,
            20,
            15,
            25,
            47,
            40,
            62,
            55,
            65,
            95,
            102,
            117,
            150,
            182,
            127,
            219,
            299,
            277,
            309,
            576,
          ],
        },
        62,
      ],
      [{ preamble: 25, seq: puzzleInput }, 438559930],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
