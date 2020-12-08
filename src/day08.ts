import { EventEmitter } from "events";
import im from "immutable";
import { Machine, MachineError, parseProgram, runMachine } from "./vm";
// import { SideLogger } from "./aoc";

// const log = new SideLogger("day08.log");

/*
 * Run your copy of the boot code. Immediately before any instruction is
 * executed a second time, what value is in the accumulator?
 */
export function part1(input: string[]): number {
  const program = parseProgram(input);
  let machine = new Machine({ program });
  let visited = im.Set();
  // I'm gonna assume this infinite loop thing is just for this challenge, so
  // I'll have a tracer local to day08 looking for infinite loops and throwing
  // an error when they happen.
  const tracer = new EventEmitter();
  tracer.on("step", (m: Machine) => {
    const { instructionPointer } = m;
    if (visited.has(instructionPointer)) {
      throw new MachineError("Infinite loop detected", m);
    }
    visited = visited.add(instructionPointer);
  });

  try {
    runMachine(machine, tracer);
  } catch (e) {
    if (e instanceof MachineError) {
      return e.machine.acc;
    }
  }

  while (!visited.has(machine.instructionPointer)) {
    visited.add(machine.instructionPointer);
    machine = machine.execute();
  }
  return machine.acc;
}

/*
 * Fix the program so that it terminates normally by changing exactly one jmp
 * (to nop) or nop (to jmp). What is the value of the accumulator after the
 * program terminates?
 */
export function part2(input: string[]): number {
  // log.clear();

  const program = parseProgram(input);
  for (
    let patchInstruction = 0;
    patchInstruction < program.size;
    ++patchInstruction
  ) {
    try {
      let visited = im.Set();
      const tracer = new EventEmitter();
      tracer.on("step", (m: Machine) => {
        // log.log(`  ${m}`);
        const { instructionPointer } = m;
        if (visited.has(instructionPointer)) {
          throw new MachineError("Infinite loop detected", m);
        }
        visited = visited.add(instructionPointer);
      });

      const machine = new Machine({ program });
      let res: Machine | null = null;
      const toPatch = program.get(patchInstruction);
      switch (toPatch?.operation) {
        case "jmp": {
          // log.log(`Patching #${patchInstruction} ${toPatch} => nop`);
          const patched = machine.setIn(
            ["program", patchInstruction, "operation"],
            "nop"
          );
          res = runMachine(patched, tracer);
          break;
        }
        case "nop": {
          // log.log(`Patching #${patchInstruction} ${toPatch} => jmp`);
          const patched = machine.setIn(
            ["program", patchInstruction, "operation"],
            "jmp"
          );
          res = runMachine(patched, tracer);
          break;
        }
        default:
          // skip
          break;
      }

      if (res) {
        return res.acc;
      }
    } catch (err) {
      if (err.message !== "Infinite loop detected") {
        // unexpected error
        throw err;
      }
    }
  }

  return NaN;
}
