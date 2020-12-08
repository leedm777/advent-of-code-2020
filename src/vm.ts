import { EventEmitter } from "events";
import _ from "lodash";
import im from "immutable";

/*
 * The boot code is represented as a text file with one instruction per line of
 * text. Each instruction consists of an operation (acc, jmp, or nop) and an
 * argument (a signed number like +4 or -20).
 */
export class Instruction extends im.Record({ operation: "nop", arg: 0 }) {
  toString(): string {
    return `[${this.operation} ${this.arg}]`;
  }
}

export function parseInstruction(input: string): Instruction {
  const [operation, argStr] = _.split(input, " ");
  const arg = parseInt(argStr, 10);
  return new Instruction({ operation, arg });
}

export type Program = im.List<Instruction>;

export function parseProgram(input: string[]): Program {
  return im.List<Instruction>(_.map(input, parseInstruction));
}

export class Machine extends im.Record({
  program: parseProgram([]),
  instructionPointer: 0,
  acc: 0,
}) {
  execute(): Machine {
    const { program, instructionPointer, acc } = this;
    const inst = program.get(instructionPointer);
    if (!inst) {
      throw new Error(`Invalid instruction pointer ${this.instructionPointer}`);
    }
    const { operation, arg } = inst;

    switch (operation) {
      case "acc":
        /*
         * acc increases or decreases a single global value called the
         * accumulator by the value given in the argument. For example, acc +7
         *  would increase the accumulator by 7. The accumulator starts at 0.
         * After an acc instruction, the instruction immediately below it is
         *  executed next.
         */
        return this.merge({
          instructionPointer: instructionPointer + 1,
          acc: acc + arg,
        });
      case "jmp":
        /*
         * jmp jumps to a new instruction relative to itself. The next
         * instruction to execute is found using the argument as an offset from
         * the jmp instruction; for example, jmp +2 would skip the next
         * instruction, jmp +1 would continue to the instruction immediately
         * below it, and jmp -20 would cause the instruction 20 lines above to
         * be executed next.
         */
        return this.merge({
          instructionPointer: instructionPointer + arg,
        });
      case "nop":
        /*
         * nop stands for No OPeration - it does nothing. The instruction
         * immediately below it is executed next.
         */
        return this.merge({
          instructionPointer: instructionPointer + 1,
        });
      default:
        throw new MachineError(`Unknown operation ${operation}`, this);
    }
  }

  isTerminated(): boolean {
    return this.instructionPointer >= this.program.size;
  }

  toString(): string {
    const { program, instructionPointer, acc } = this;
    const inst = program.get(instructionPointer);
    return `#${instructionPointer} inst=${inst} acc=${acc}`;
  }

  static fromJS({
    program,
    instructionPointer = 0,
    acc = 0,
  }: {
    program: { operation: string; arg: number }[];
    instructionPointer: number;
    acc: number;
  }): Machine {
    return new Machine({
      program: im.List<Instruction>(_.map(program, (i) => new Instruction(i))),
      instructionPointer,
      acc,
    });
  }
}

export function runMachine(m: Machine, tracer?: EventEmitter): Machine {
  while (!m.isTerminated()) {
    tracer?.emit("step", m);
    m = m.execute();
  }
  return m;
}

export class MachineError extends Error {
  public readonly machine: Machine;

  constructor(msg: string, machine: Machine) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.machine = machine;
  }
}
