import { part1, part2, parseLife, renderLife, iterateLife } from "./day17";
import { readFile, splitLines } from "./aoc";
import _ from "lodash";

const puzzleInput = splitLines(readFile("./src/day17.txt"));

const sequence = [
  [[".#.", "..#", "###"]],
  [
    ["#..", "..#", ".#."],
    ["#.#", ".##", ".#."],
    ["#..", "..#", ".#."],
  ],
  [
    [".....", ".....", "..#..", ".....", "....."],
    ["..#..", ".#..#", "....#", ".#...", "....."],
    ["##...", "##...", "#....", "....#", ".###."],
    ["..#..", ".#..#", "....#", ".#...", "....."],
    [".....", ".....", "..#..", ".....", "....."],
  ],
  [
    [
      ".......",
      ".......",
      "..##...",
      "..###..",
      ".......",
      ".......",
      ".......",
    ],

    [
      "..#....",
      "...#...",
      "#......",
      ".....##",
      ".#...#.",
      "..#.#..",
      "...#...",
    ],

    [
      "...#...",
      ".......",
      "#......",
      ".......",
      ".....##",
      ".##.#..",
      "...#...",
    ],

    [
      "..#....",
      "...#...",
      "#......",
      ".....##",
      ".#...#.",
      "..#.#..",
      "...#...",
    ],

    [
      ".......",
      ".......",
      "..##...",
      "..###..",
      ".......",
      ".......",
      ".......",
    ],
  ],
];

describe("day17", () => {
  describe("parseLife", () => {
    it.each([
      [
        [
          ["#..", "..#", ".#."],
          ["#.#", ".##", ".#."],
          ["#..", "..#", ".#."],
        ],
        new Set([
          "0,0,0",
          "2,1,0",
          "1,2,0",
          "0,0,1",
          "2,0,1",
          "1,1,1",
          "2,1,1",
          "1,2,1",
          "0,0,2",
          "2,1,2",
          "1,2,2",
        ]),
      ],
    ])("input %#", (input, expected) => {
      const actual = parseLife(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("renderLife", () => {
    it.each(_.map(sequence, (s) => [s]))("input %#", (input) => {
      const parse = parseLife(input);
      const actual = renderLife(parse);
      expect(actual).toStrictEqual(input);
    });
  });

  describe("iterateLife", () => {
    it.each([
      [sequence[0], sequence[1]],
      [sequence[1], sequence[2]],
      [sequence[2], sequence[3]],
    ])("input %#", (input, expected) => {
      const parse = parseLife(input);
      const next = iterateLife(parse);
      expect(renderLife(next)).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [sequence[0][0], 112],
      [puzzleInput, 315],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [sequence[0][0], 848],
      [puzzleInput, 1520],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
