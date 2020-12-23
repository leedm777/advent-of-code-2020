import {
  parseCupGame,
  parseCups,
  part1,
  part2,
  playCupGame,
  playCupGameFast,
  renderCupGame,
} from "./day23";
import { readFile } from "./aoc";
import _ from "lodash";

const puzzleInput = _.trim(readFile("./src/day23.txt"));

describe("day23", () => {
  describe("play", () => {
    it.each([
      ["389125467", "289154673"],
      ["289154673", "546789132"],
    ])("%s -> %s", (input, expected) => {
      const actual = playCupGame(parseCups(input));
      expect(actual).toStrictEqual(parseCups(expected));
    });
  });

  describe("part 1", () => {
    it.each([
      ["389125467", "67384529"],
      [puzzleInput, "28793654"],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("playFast", () => {
    it.each([
      ["389125467", "289154673"],
      ["289154673", "546789132"],
    ])("%s -> %s", (input, expected) => {
      const actual = playCupGameFast(parseCupGame(input, 9));
      expect(renderCupGame(actual)).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      ["389125467", 934001 * 159792],
      [puzzleInput, 359206768694],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
