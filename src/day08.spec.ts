import { part1, part2, parseInstruction, execute } from "./day08";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day08.txt"));

describe("day08", () => {
  describe("parseInstruction", () => {
    it.each([
      ["cmd +99", { operation: "cmd", arg: 99 }],
      ["cmd -99", { operation: "cmd", arg: -99 }],
    ])("input %#", (input, expected) => {
      const actual = parseInstruction(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("execute", () => {
    describe("acc", () => {
      it("should accumulate", () => {
        const machine = {
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "acc",
              arg: 99,
            },
          ],
        };
        const actual = execute(machine);
        expect(actual).toStrictEqual({
          acc: 99,
          instructionPointer: 1,
          program: [
            {
              operation: "acc",
              arg: 99,
            },
          ],
        });
      });
    });

    describe("jmp", () => {
      it("should jump", () => {
        const machine = {
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "jmp",
              arg: 99,
            },
          ],
        };
        const actual = execute(machine);
        expect(actual).toStrictEqual({
          acc: 0,
          instructionPointer: 99,
          program: [
            {
              operation: "jmp",
              arg: 99,
            },
          ],
        });
      });
    });

    describe("nop", () => {
      it("should no-op", () => {
        const machine = {
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "nop",
              arg: 99,
            },
          ],
        };
        const actual = execute(machine);
        expect(actual).toStrictEqual({
          acc: 0,
          instructionPointer: 1,
          program: [
            {
              operation: "nop",
              arg: 99,
            },
          ],
        });
      });
    });
  });

  describe("part 1", () => {
    it.each([
      [
        [
          "nop +0",
          "acc +1",
          "jmp +4",
          "acc +3",
          "jmp -3",
          "acc -99",
          "acc +1",
          "jmp -4",
          "acc +6",
        ],
        5,
      ],
      [puzzleInput, 1727],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [
        [
          "nop +0",
          "acc +1",
          "jmp +4",
          "acc +3",
          "jmp -3",
          "acc -99",
          "acc +1",
          "jmp -4",
          "acc +6",
        ],
        8,
      ],
      [puzzleInput, 552],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
