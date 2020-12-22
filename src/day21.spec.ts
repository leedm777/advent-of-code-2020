import { part1, part2 } from "./day21";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day21.txt"));

const exampleInput = [
  "mxmxvkd kfcds sqjhc nhms (contains dairy, fish)",
  "trh fvjkl sbzzf mxmxvkd (contains dairy)",
  "sqjhc fvjkl (contains soy)",
  "sqjhc mxmxvkd sbzzf (contains fish)",
];

describe("day21", () => {
  describe("part 1", () => {
    it.each([
      [exampleInput, 5],
      [puzzleInput, 2176],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [exampleInput, "mxmxvkd,sqjhc,fvjkl"],
      [puzzleInput, "lvv,xblchx,tr,gzvsg,jlsqx,fnntr,pmz,csqc"],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
