import {
  parseTickets,
  part1,
  part2,
  processOfElimination,
  Tickets,
} from "./day16";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day16.txt"));

describe("day16", () => {
  describe("parseTickets", () => {
    it.each([
      [
        [
          "class: 1-3 or 5-7",
          "row: 6-11 or 33-44",
          "seat: 13-40 or 45-50",
          "",
          "your ticket:",
          "7,1,14",
          "",
          "nearby tickets:",
          "7,3,47",
          "40,4,50",
          "55,2,20",
          "38,6,12",
        ],
        {
          fields: {
            class: [
              [1, 3],
              [5, 7],
            ],
            row: [
              [6, 11],
              [33, 44],
            ],
            seat: [
              [13, 40],
              [45, 50],
            ],
          },
          yourTicket: [7, 1, 14],
          nearbyTickets: [
            [7, 3, 47],
            [40, 4, 50],
            [55, 2, 20],
            [38, 6, 12],
          ],
        } as Tickets,
      ],
    ])("input %#", (input, expected) => {
      const actual = parseTickets(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [
        [
          "class: 1-3 or 5-7",
          "row: 6-11 or 33-44",
          "seat: 13-40 or 45-50",
          "",
          "your ticket:",
          "7,1,14",
          "",
          "nearby tickets:",
          "7,3,47",
          "40,4,50",
          "55,2,20",
          "38,6,12",
        ],
        71,
      ],
      [puzzleInput, 32842],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("processOfElminiation", () => {
    it("should work with the example", async () => {
      const tickets = parseTickets([
        "class: 0-1 or 4-19",
        "row: 0-5 or 8-19",
        "seat: 0-13 or 16-19",
        "",
        "your ticket:",
        "11,12,13",
        "",
        "nearby tickets:",
        "3,9,18",
        "15,1,5",
        "5,14,9",
      ]);

      const actual = processOfElimination(tickets);
      expect(actual).toStrictEqual({
        class: 1,
        row: 0,
        seat: 2,
      });
    });
  });

  describe("part 2", () => {
    it.each([[puzzleInput, 2628667251989]])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
