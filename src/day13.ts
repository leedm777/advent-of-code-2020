import _ from "lodash";
import { MinHeap, SideLogger } from "./aoc";

export function helperOfTheDay(input: string[]): number {
  return 0;
}

export function part1([earliestStr, busIdStr]: string[]): number {
  const earliest = parseInt(earliestStr, 10);
  const busIds = _(busIdStr)
    .split(",")
    .filter((id) => id !== "x")
    .map((i) => parseInt(i, 10));

  const waitTimes = busIds.map((id) => [id, id - (earliest % id)]);
  const minWaitTime = waitTimes.map(([, waitTime]) => waitTime).min();
  const [busId, waitTime] = waitTimes.find(
    ([, waitTime]) => waitTime === minWaitTime
  ) as [number, number];
  return busId * waitTime;
}

interface Bus {
  busId: number;
  offset: number;
  nextArrival: number;
}

const log = { log: _.noop, clear: _.noop }; //new SideLogger("day13.log");
log.clear();

export function part2([, busIdStr]: string[]): number {
  const schedule = new MinHeap<Bus>();

  function reschedule(bus: Bus) {
    bus.nextArrival = bus.nextArrival + bus.busId;
    schedule.insert(bus.nextArrival, bus);
  }

  let firstBus: Bus | null = null;

  _(busIdStr)
    .split(",")
    .map((i, offset) => {
      const busId = parseInt(i, 10);
      return { offset, busId, nextArrival: busId };
    })
    .filter(({ busId }) => !_.isNaN(busId))
    .tap(([b]) => (firstBus = b))
    .forEach((bus) => schedule.insert(bus.nextArrival, bus));

  if (!firstBus) {
    return NaN;
  }

  const isSolved = (): boolean => {
    const next = schedule.peek() as Bus;
    if (next.busId !== firstBus.busId) {
      return false;
    }
    const t = next.nextArrival;
    return _.every(schedule.heap, ({ node }: { node: Bus }) => {
      const good = node.nextArrival - t === node.offset;
      log.log(
        `  ${node.busId}: (${node.nextArrival} - ${t} === ${node.offset}) === ${good}`
      );
      return good;
    });
  };

  while (!isSolved()) {
    const next = schedule.extract() as Bus;
    log.log(`${next.nextArrival}: ${next.busId}`);
    reschedule(next);
  }

  return schedule.peek().nextArrival;
}
