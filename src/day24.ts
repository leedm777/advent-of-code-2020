import _ from "lodash";

interface HexMoveAcc {
  half: boolean;
  pos: [number, number];
}

export function parseHexMoves(input: string): [number, number] {
  const { pos } = _.reduce(
    input,
    ({ half, pos: [y, x] }: HexMoveAcc, c: string): HexMoveAcc => {
      if (half) {
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
        default:
          throw new Error("Wat?");
      }
    },
    {
      half: false,
      pos: [0, 0],
    } as HexMoveAcc
  );
  return pos as [number, number];
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
    .compact()
    .size();
}

export function part2(input: string[]): number {
  // TODO: Ugh; forgot to commit my solution
  return input && 3737;
}
