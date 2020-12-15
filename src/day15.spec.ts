import { part1, part2, playRound } from "./day15";
import { readFile } from "./aoc";
import _ from "lodash";

const puzzleInput = _.chain(readFile("./src/day15.txt"))
  .trim()
  .split(",")
  .map((s) => parseInt(s, 10))
  .value();

describe("day15", () => {
  describe("playRound", () => {
    it.each([
      [
        {
          roundsPlayed: 0,
          seq: [],
          startingNumbers: [0, 3, 6],
        },
        {
          roundsPlayed: 1,
          seq: [0],
          startingNumbers: [3, 6],
        },
      ],

      [
        {
          roundsPlayed: 3,
          seq: [0, 3, 6],
          startingNumbers: [],
        },
        {
          roundsPlayed: 4,
          seq: [0, 3, 6, 0],
          startingNumbers: [],
        },
      ],
      [
        {
          roundsPlayed: 4,
          seq: [0, 3, 6, 0],
          startingNumbers: [],
        },
        {
          roundsPlayed: 5,
          seq: [0, 3, 6, 0, 3],
          startingNumbers: [],
        },
      ],
    ])("input %#", (input, expected) => {
      const actual = playRound(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [[0, 3, 6], 436],
      [[1, 3, 2], 1],
      [[2, 1, 3], 10],
      [[1, 2, 3], 27],
      [[2, 3, 1], 78],
      [[3, 2, 1], 438],
      [[3, 1, 2], 1836],
      [puzzleInput, 929],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [[0, 3, 6], 175594],
      [[1, 3, 2], 2578],
      [[2, 1, 3], 3544142],
      [[1, 2, 3], 261214],
      [[2, 3, 1], 6895259],
      [[3, 2, 1], 18],
      [[3, 1, 2], 362],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
