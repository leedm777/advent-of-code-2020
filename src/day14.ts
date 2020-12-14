import _ from "lodash";
import { sscanf } from "scanf";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day14.log", true);

export function part1(input: string[]): bigint {
  return (
    (_.chain(input)
      .map((s) => _.split(s, " = "))
      .reduce(
        ({ andMask, orMask, mem }, [command, valueStr]) => {
          if (command === "mask") {
            let newAndMask = 0n;
            let newOrMask = 0n;

            _.forEach(valueStr, (ch) => {
              newAndMask <<= 1n;
              newOrMask <<= 1n;
              switch (ch) {
                case "X":
                  newAndMask |= 1n;
                  break;
                case "0":
                  break;
                case "1":
                  newAndMask |= 1n;
                  newOrMask |= 1n;
                  break;
              }
            });

            return {
              andMask: newAndMask,
              orMask: newOrMask,
              mem,
            };
          }

          const value = BigInt(valueStr);
          // TODO: sscanf types are wrong
          const addr = (sscanf(command, "mem[%d]") as unknown) as number;

          mem[addr] = (value & andMask) | orMask;

          return {
            andMask,
            orMask,
            mem,
          };
        },
        {
          andMask: 0xfffffffffn,
          orMask: 0n,
          mem: [] as bigint[],
        }
      )
      .thru(({ mem }) => mem)
      // TODO: sum of bigint gives number
      .sum()
      .value() as unknown) as bigint
  );
}

export function part2(input: string[]): number {
  return (
    _.chain(input)
      .map((s) => _.split(s, " = "))
      .reduce(
        ({ mask, mem }, [command, valueStr]) => {
          log.log(`${command} = ${valueStr}`);
          if (command === "mask") {
            return {
              mask: valueStr,
              mem,
            };
          }

          const value = parseInt(valueStr, 10);
          // TODO: sscanf types are wrong
          const addr = (sscanf(command, "mem[%d]") as unknown) as number;
          const addrBits = _(addr)
            .thru((a) => a.toString(2))
            .split("")
            .join("")
            .padStart(36, "0")
            .split("");
          const maskBits = _.split(mask, "");

          const addrs = _.reduce(
            _.zip(maskBits, addrBits),
            (addrs, [maskBit, addrBit]) => {
              addrs = _.map(addrs, (a) => a << 1n);
              switch (maskBit) {
                case "0":
                  if (addrBit === "1") {
                    addrs = _.map(addrs, (a) => a | 1n);
                  }
                  break;
                case "1":
                  addrs = _.map(addrs, (a) => a | 1n);
                  break;
                case "X":
                  addrs = _.concat(
                    addrs,
                    _.map(addrs, (a) => a | 1n)
                  );
                  break;
              }
              return addrs;
            },
            [0n]
          );

          _.forEach(addrs, (a) => mem.set(a, value));

          return {
            mask,
            mem,
          };
        },
        {
          mask: "",
          mem: new Map<bigint, number>(),
        }
      )
      .thru(({ mem }) => {
        return Array.from(mem.values());
      })
      // TODO: sum of bigint gives number
      .sum()
      .value()
  );
}
