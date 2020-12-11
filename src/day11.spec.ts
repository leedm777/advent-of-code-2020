import {
  part1,
  part2,
  nextSeating,
  nextSeatingPartTwo,
  buildNeighborMap,
} from "./day11";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day11.txt"));

const exampleSequence = [
  [
    // 0
    "L.LL.LL.LL",
    "LLLLLLL.LL",
    "L.L.L..L..",
    "LLLL.LL.LL",
    "L.LL.LL.LL",
    "L.LLLLL.LL",
    "..L.L.....",
    "LLLLLLLLLL",
    "L.LLLLLL.L",
    "L.LLLLL.LL",
  ],
  [
    // 1
    "#.##.##.##",
    "#######.##",
    "#.#.#..#..",
    "####.##.##",
    "#.##.##.##",
    "#.#####.##",
    "..#.#.....",
    "##########",
    "#.######.#",
    "#.#####.##",
  ],
  [
    // 2
    "#.LL.L#.##",
    "#LLLLLL.L#",
    "L.L.L..L..",
    "#LLL.LL.L#",
    "#.LL.LL.LL",
    "#.LLLL#.##",
    "..L.L.....",
    "#LLLLLLLL#",
    "#.LLLLLL.L",
    "#.#LLLL.##",
  ],
  [
    // 3
    "#.##.L#.##",
    "#L###LL.L#",
    "L.#.#..#..",
    "#L##.##.L#",
    "#.##.LL.LL",
    "#.###L#.##",
    "..#.#.....",
    "#L######L#",
    "#.LL###L.L",
    "#.#L###.##",
  ],
  [
    // 4
    "#.#L.L#.##",
    "#LLL#LL.L#",
    "L.L.L..#..",
    "#LLL.##.L#",
    "#.LL.LL.LL",
    "#.LL#L#.##",
    "..L.L.....",
    "#L#LLLL#L#",
    "#.LLLLLL.L",
    "#.#L#L#.##",
  ],
  [
    // 5
    "#.#L.L#.##",
    "#LLL#LL.L#",
    "L.#.L..#..",
    "#L##.##.L#",
    "#.#L.LL.LL",
    "#.#L#L#.##",
    "..L.L.....",
    "#L#L##L#L#",
    "#.LLLLLL.L",
    "#.#L#L#.##",
  ],
];

const exampleSequencePartTwo = [
  [
    // 0
    "L.LL.LL.LL",
    "LLLLLLL.LL",
    "L.L.L..L..",
    "LLLL.LL.LL",
    "L.LL.LL.LL",
    "L.LLLLL.LL",
    "..L.L.....",
    "LLLLLLLLLL",
    "L.LLLLLL.L",
    "L.LLLLL.LL",
  ],
  [
    // 1
    "#.##.##.##",
    "#######.##",
    "#.#.#..#..",
    "####.##.##",
    "#.##.##.##",
    "#.#####.##",
    "..#.#.....",
    "##########",
    "#.######.#",
    "#.#####.##",
  ],
  [
    // 2
    "#.LL.LL.L#",
    "#LLLLLL.LL",
    "L.L.L..L..",
    "LLLL.LL.LL",
    "L.LL.LL.LL",
    "L.LLLLL.LL",
    "..L.L.....",
    "LLLLLLLLL#",
    "#.LLLLLL.L",
    "#.LLLLL.L#",
  ],
  [
    // 3
    "#.L#.##.L#",
    "#L#####.LL",
    "L.#.#..#..",
    "##L#.##.##",
    "#.##.#L.##",
    "#.#####.#L",
    "..#.#.....",
    "LLL####LL#",
    "#.L#####.L",
    "#.L####.L#",
  ],
  [
    // 4
    "#.L#.L#.L#",
    "#LLLLLL.LL",
    "L.L.L..#..",
    "##LL.LL.L#",
    "L.LL.LL.L#",
    "#.LLLLL.LL",
    "..L.L.....",
    "LLLLLLLLL#",
    "#.LLLLL#.L",
    "#.L#LL#.L#",
  ],
  [
    // 5
    "#.L#.L#.L#",
    "#LLLLLL.LL",
    "L.L.L..#..",
    "##L#.#L.L#",
    "L.L#.#L.L#",
    "#.L####.LL",
    "..#.#.....",
    "LLL###LLL#",
    "#.LLLLL#.L",
    "#.L#LL#.L#",
  ],
  [
    // 6
    "#.L#.L#.L#",
    "#LLLLLL.LL",
    "L.L.L..#..",
    "##L#.#L.L#",
    "L.L#.LL.L#",
    "#.LLLL#.LL",
    "..#.L.....",
    "LLL###LLL#",
    "#.LLLLL#.L",
    "#.L#LL#.L#",
  ],
];

describe("day11", () => {
  describe("nextSeating", () => {
    it.each([
      [exampleSequence[0], exampleSequence[1]],
      [exampleSequence[1], exampleSequence[2]],
      [exampleSequence[2], exampleSequence[3]],
      [exampleSequence[3], exampleSequence[4]],
      [exampleSequence[4], exampleSequence[5]],
      [exampleSequence[5], exampleSequence[5]],
    ])("input %#", (input, expected) => {
      const actual = nextSeating(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [exampleSequence[0], 37],
      [puzzleInput, 2275],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("nextSeatingPartTwo", () => {
    it.each([
      [exampleSequencePartTwo[0], exampleSequencePartTwo[1]],
      [exampleSequencePartTwo[1], exampleSequencePartTwo[2]],
      [exampleSequencePartTwo[2], exampleSequencePartTwo[3]],
      [exampleSequencePartTwo[3], exampleSequencePartTwo[4]],
      [exampleSequencePartTwo[4], exampleSequencePartTwo[5]],
      [exampleSequencePartTwo[6], exampleSequencePartTwo[6]],
      [exampleSequencePartTwo[6], exampleSequencePartTwo[6]],
    ])("input %#", (input, expected) => {
      const map = buildNeighborMap(exampleSequencePartTwo[0]);
      const actual = nextSeatingPartTwo(input, map);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [exampleSequencePartTwo[0], 26],
      [puzzleInput, 2121],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
