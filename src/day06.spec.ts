import {
  part1,
  part2,
  countUnionAnswers,
  countIntersectionAnswers,
} from "./day06";
import { readFile, splitChunks } from "./aoc";

const puzzleInput = splitChunks(readFile("./src/day06.txt"));

describe("day06", () => {
  describe("countAnswers", () => {
    it.each([
      ["", 0],
      ["abcx\nabcy\nabcz", 6],
      ["abc", 3],
      ["a\nb\nc", 3],
      ["ab\nac", 3],
      ["a\na\na\na", 1],
      ["b", 1],
    ])("input %#", (input, expected) => {
      const actual = countUnionAnswers(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([[puzzleInput, 6878]])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("countCommonAnswers", () => {
    it.each([
      ["", 0],
      ["abcx\nabcy\nabcz", 3],
      ["abc", 3],
      ["a\nb\nc", 0],
      ["ab\nac", 1],
      ["a\na\na\na", 1],
      ["b", 1],
    ])("input %#", (input, expected) => {
      const actual = countIntersectionAnswers(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([[puzzleInput, 3464]])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
