import { part1, part2, parseLuggageRule } from "./day07";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day07.txt"));

describe("day07", () => {
  describe("parseLuggageRule", () => {
    it.each([
      [
        "light red bags contain 1 bright white bag, 2 muted yellow bags",
        {
          outerColor: "light red",
          innerColors: {
            "bright white": 1,
            "muted yellow": 2,
          },
        },
      ],
      [
        "faded blue bags contain no other bags.",
        {
          outerColor: "faded blue",
          innerColors: {},
        },
      ],
      [
        "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.",
        {
          outerColor: "shiny gold",
          innerColors: {
            "dark olive": 1,
            "vibrant plum": 2,
          },
        },
      ],
    ])("input %#", (input, expected) => {
      const actual = parseLuggageRule(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [
        [
          "light red bags contain 1 bright white bag, 2 muted yellow bags.",
          "dark orange bags contain 3 bright white bags, 4 muted yellow bags.",
          "bright white bags contain 1 shiny gold bag.",
          "muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.",
          "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.",
          "dark olive bags contain 3 faded blue bags, 4 dotted black bags.",
          "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.",
          "faded blue bags contain no other bags.",
          "dotted black bags contain no other bags.",
        ],
        4,
      ],
      [puzzleInput, 372],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        [
          "light red bags contain 1 bright white bag, 2 muted yellow bags.",
          "dark orange bags contain 3 bright white bags, 4 muted yellow bags.",
          "bright white bags contain 1 shiny gold bag.",
          "muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.",
          "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.",
          "dark olive bags contain 3 faded blue bags, 4 dotted black bags.",
          "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.",
          "faded blue bags contain no other bags.",
          "dotted black bags contain no other bags.",
        ],
        32,
      ],
      [
        [
          "shiny gold bags contain 2 dark red bags.",
          "dark red bags contain 2 dark orange bags.",
          "dark orange bags contain 2 dark yellow bags.",
          "dark yellow bags contain 2 dark green bags.",
          "dark green bags contain 2 dark blue bags.",
          "dark blue bags contain 2 dark violet bags.",
          "dark violet bags contain no other bags.",
        ],
        126,
      ],
      [puzzleInput, 8015],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
