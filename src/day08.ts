import _ from "lodash";
import { SideLogger } from "./aoc";

const log = new SideLogger("day08.log");

interface Instruction {
  operation: string;
  arg: number;
}

interface Machine {
  program: Instruction[];
  instructionPointer: number;
  acc: number;
}

export function parseInstruction(input: string): Instruction {
  const [operation, argStr] = _.split(input, " ");
  const arg = parseInt(argStr, 10);
  return { operation, arg };
}

export function execute(machine: Machine): Machine {
  const { program, instructionPointer, acc } = machine;
  const { operation, arg } = program[instructionPointer];

  log.log(`    ${operation} ${arg}`);
  switch (operation) {
    case "acc":
      return {
        ...machine,
        instructionPointer: instructionPointer + 1,
        acc: acc + arg,
      };
    case "jmp":
      return {
        ...machine,
        instructionPointer: instructionPointer + arg,
      };
    case "nop":
      return {
        ...machine,
        instructionPointer: instructionPointer + 1,
      };
    default:
      throw new Error(`Unknown operation ${operation}`);
  }
}

export function part1(input: string[]): number {
  const program = _.map(input, parseInstruction);
  let machine = { program, acc: 0, instructionPointer: 0 };
  const visited = new Set();

  while (!visited.has(machine.instructionPointer)) {
    visited.add(machine.instructionPointer);
    machine = execute(machine);
  }
  return machine.acc;
}

function run(machine: Machine): number | null {
  const visited = new Set();

  while (true) {
    log.log(`  ${machine.instructionPointer}`);
    visited.add(machine.instructionPointer);
    machine = execute(machine);
    log.log(`    acc: ${machine.acc}`);
    log.log(`    ip:  ${machine.instructionPointer}`);

    if (visited.has(machine.instructionPointer)) {
      return null;
    }

    if (machine.instructionPointer >= machine.program.length) {
      return machine.acc;
    }
  }
}

export function part2(input: string[]): number {
  const program = _.map(input, parseInstruction);
  log.clear();

  for (
    let patchInstruction = 0;
    patchInstruction < program.length;
    ++patchInstruction
  ) {
    const machine: Machine = { program: [], acc: 0, instructionPointer: 0 };
    let res = null;
    switch (program[patchInstruction].operation) {
      case "jmp":
        log.log(
          `Patching #${patchInstruction} jmp ${program[patchInstruction].arg}`
        );
        machine.program = _.cloneDeep(program);
        machine.program[patchInstruction].operation = "nop";
        res = run(machine);
        break;
      case "nop":
        log.log(
          `Patching #${patchInstruction} nop ${program[patchInstruction].arg}`
        );
        machine.program = _.cloneDeep(program);
        machine.program[patchInstruction].operation = "jmp";
        res = run(machine);
        break;
      default:
        // skip
        break;
    }
    if (!_.isNil(res)) {
      return res;
    }
  }

  return NaN;
}
