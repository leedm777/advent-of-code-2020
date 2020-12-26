import _ from "lodash";

export function parseHexMoves(input: string): [number, number] {
  const { pos } = _.reduce(
    input,
    ({ half, pos: [y, x] }, c) => {
      if (half === true) {
        switch (c) {
          case "e":
            return {
              half: false,
              pos: [y, x + 1],
            };
          case "w":
            return {
              half: false,
              pos: [y, x - 1],
            };
          default:
            throw new Error("Wat?");
        }
      }

      switch (c) {
        case "n":
          return {
            half: true,
            pos: [y - 1, x],
          };
        case "s":
          return {
            half: true,
            pos: [y + 1, x],
          };
        case "e":
          return {
            half: false,
            pos: [y, x + 2],
          };
        case "w":
          return {
            half: false,
            pos: [y, x - 2],
          };
      }
    },
    {
      half: false,
      pos: [0, 0],
    }
  );
  return pos;
}

export function part1(input: string[]): number {
  const tiles = _.map(input, parseHexMoves);
  const blackMap = new Map<string, boolean>();
  for (const [y, x] of tiles) {
    const s = `${x},${y}`;
    const isBlack = blackMap.get(s) || false;
    blackMap.set(s, !isBlack);
  }
  return _(blackMap)
    .thru((m) => new Array(...m.values()))
    .filter((isBlack) => isBlack)
    .size();
}

export function part2(input: string[]): number {
  return 0;
}
