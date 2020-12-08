import { EventEmitter } from "events";
import {
  parseInstruction,
  Instruction,
  Machine,
  parseProgram,
  runMachine,
} from "./vm";

describe("virtual machine", () => {
  describe("parseInstruction", () => {
    it.each([
      ["cmd +99", { operation: "cmd", arg: 99 }],
      ["cmd -99", { operation: "cmd", arg: -99 }],
    ])("input %#", (input, expected) => {
      const actual = parseInstruction(input);
      expect(actual).toStrictEqual(new Instruction(expected));
    });
  });

  describe("execute", () => {
    describe("acc", () => {
      it("should accumulate", () => {
        const machine = Machine.fromJS({
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "acc",
              arg: 99,
            },
          ],
        });
        const actual = machine.execute();
        expect(actual).toStrictEqual(
          Machine.fromJS({
            acc: 99,
            instructionPointer: 1,
            program: [
              {
                operation: "acc",
                arg: 99,
              },
            ],
          })
        );
      });
    });

    describe("jmp", () => {
      it("should jump", () => {
        const machine = Machine.fromJS({
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "jmp",
              arg: 99,
            },
          ],
        });
        const actual = machine.execute();
        expect(actual).toStrictEqual(
          Machine.fromJS({
            acc: 0,
            instructionPointer: 99,
            program: [
              {
                operation: "jmp",
                arg: 99,
              },
            ],
          })
        );
      });
    });

    describe("nop", () => {
      it("should no-op", () => {
        const machine = Machine.fromJS({
          acc: 0,
          instructionPointer: 0,
          program: [
            {
              operation: "nop",
              arg: 99,
            },
          ],
        });
        const actual = machine.execute();
        expect(actual).toStrictEqual(
          Machine.fromJS({
            acc: 0,
            instructionPointer: 1,
            program: [
              {
                operation: "nop",
                arg: 99,
              },
            ],
          })
        );
      });
    });
  });

  describe("runMachine", () => {
    const machine = new Machine({
      program: parseProgram(["acc +100", "jmp +2", "acc 10", "acc +214"]),
    });

    it("should run a program to completion", async () => {
      const actual = runMachine(machine);
      expect(actual).toStrictEqual(
        expect.objectContaining({
          instructionPointer: 4,
          acc: 314,
        })
      );
    });

    describe("given a trace", () => {
      it("should trace the execution", async () => {
        const steps: number[] = [];
        const tracer = new EventEmitter();
        tracer.on("step", ({ instructionPointer }: Machine) => {
          steps.push(instructionPointer);
        });

        runMachine(machine, tracer);
        expect(steps).toStrictEqual([0, 1, 3]);
      });
    });
  });
});
