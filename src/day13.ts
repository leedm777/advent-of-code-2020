import _ from "lodash";

const log = { log: _.noop, clear: _.noop };
// new SideLogger("day13.log");
log.clear();

export function part1([earliestStr, busIdStr]: string[]): number {
  const earliest = parseInt(earliestStr, 10);
  return _(busIdStr)
    .split(",")
    .filter((id) => id !== "x")
    .map((i) => parseInt(i, 10))
    .map((id) => [id, id - (earliest % id)])
    .thru((waitTimes) => {
      const minWaitTime = _(waitTimes)
        .map(([, waitTime]) => waitTime)
        .min();
      const [busId, waitTime] = _.find(
        waitTimes,
        ([, waitTime]) => waitTime === minWaitTime
      ) as [number, number];
      return busId * waitTime;
    })
    .value();
}

// interface BruteForceBus {
//   id: number;
//   offset: number;
//   nextArrival: number;
// }
//
// export function part2BruteForce([, idStr]: string[]): number {
//   const schedule = new MinHeap<BruteForceBus>();
//
//   function reschedule(bus: BruteForceBus) {
//     bus.nextArrival = bus.nextArrival + bus.id;
//     schedule.insert(bus.nextArrival, bus);
//   }
//
//   let firstBus: Bus | null = null;
//
//   _(idStr)
//     .split(",")
//     .map((i, offset) => {
//       const id = parseInt(i, 10);
//       return { offset, id, nextArrival: id };
//     })
//     .filter(({ id }) => !_.isNaN(id))
//     .tap(([b]) => (firstBus = b))
//     .forEach((bus) => schedule.insert(bus.nextArrival, bus));
//
//   if (!firstBus) {
//     return NaN;
//   }
//
//   const isSolved = (): boolean => {
//     const next = schedule.peek() as BruteForceBus;
//     if (next.id !== firstBus.id) {
//       return false;
//     }
//     const t = next.nextArrival;
//     return _.every(schedule.heap, ({ node }: { node: BruteForceBus }) => {
//       const good = node.nextArrival - t === node.offset;
//       // log.log(
//       //   `  ${node.id}: (${node.nextArrival} - ${t} === ${node.offset}) === ${good}`
//       // );
//       return good;
//     });
//   };
//
//   while (!isSolved()) {
//     const next = schedule.extract() as BruteForceBus;
//     log.log(`${next.nextArrival}: ${next.id}`);
//     reschedule(next);
//   }
//
//   return schedule.peek().nextArrival;
// }

interface Bus {
  id: number;
  offset: number;
}

function findFirst(
  k: number,
  mod: number,
  { id, offset }: Bus
): { k: number; mod: number } {
  let n = 0;
  let rem = (id - offset) % id;
  if (rem < 0) {
    rem += id;
  }
  log.log(JSON.stringify({ k, mod, id, offset }));
  while ((k + mod * n) % id !== rem) {
    log.log("  " + JSON.stringify({ n, t: k + mod * n, rem }));
    ++n;
  }

  log.log("  " + JSON.stringify({ n, t: k + mod * n, rem }));
  log.log("    " + JSON.stringify({ k, mod, n }));

  return { mod: mod * id, k: k + mod * n };
}

export function part2([, busIdStr]: string[]): number {
  const buses: Bus[] = _(busIdStr)
    .split(",")
    .map((i, offset) => {
      const id = parseInt(i, 10);
      return { offset, id };
    })
    .filter(({ id }) => !_.isNaN(id))
    .value();

  // we now have a system of equations we want to solve, where
  // bus[n].id - t % bus[n].id === bus[n].offset
  // but n could be so large we can't brute force it

  // Math-ish would be (t = (bus[n].id - bus[n].offset)) mod bus[n].id
  let k = 0;
  let mod = 1;
  let bus: Bus | undefined;
  while ((bus = buses.shift())) {
    ({ k, mod } = findFirst(k, mod, bus));
    log.log(JSON.stringify({ mod, k }));
  }

  return k;
}
