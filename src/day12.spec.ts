import { part1, part2, rotateAbout, Pos } from "./day12";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day12.txt"));

describe("day12", () => {
  describe("rotateAbout", () => {
    it.each([
      [
        [180, 42],
        [170, 38],
        [174, 28],
      ],
    ])("input %#", (waypoint, center, expected) => {
      const actual = rotateAbout(waypoint as Pos, center as Pos, 90);
      expect(actual).toStrictEqual(expected as Pos);
    });
  });

  describe("part 1", () => {
    it.each([
      [["F10", "N3", "F7", "R90", "F11"], 25],
      [puzzleInput, 2297],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [["F10", "N3", "F7", "R90", "F11"], 286],
      [puzzleInput, 89984],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
