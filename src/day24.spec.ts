import { part1, part2, parseHexMoves } from "./day24";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day24.txt"));

describe("day24", () => {
  describe("parseHexMoves", () => {
    it.each([
      ["e", [0, 2]],
      ["w", [0, -2]],
      ["ne", [-1, 1]],
      ["sw", [1, -1]],
      ["nese", [0, 2]],
    ])("input %s -> %s", (input, expected) => {
      const actual = parseHexMoves(input);
      expect(actual).toStrictEqual(expected as [number, number]);
    });
  });

  describe("part 1", () => {
    it.each([
      [
        [
          "sesenwnenenewseeswwswswwnenewsewsw",
          "neeenesenwnwwswnenewnwwsewnenwseswesw",
          "seswneswswsenwwnwse",
          "nwnwneseeswswnenewneswwnewseswneseene",
          "swweswneswnenwsewnwneneseenw",
          "eesenwseswswnenwswnwnwsewwnwsene",
          "sewnenenenesenwsewnenwwwse",
          "wenwwweseeeweswwwnwwe",
          "wsweesenenewnwwnwsenewsenwwsesesenwne",
          "neeswseenwwswnwswswnw",
          "nenwswwsewswnenenewsenwsenwnesesenew",
          "enewnwewneswsewnwswenweswnenwsenwsw",
          "sweneswneswneneenwnewenewwneswswnese",
          "swwesenesewenwneswnwwneseswwne",
          "enesenwswwswneneswsenwnewswseenwsese",
          "wnwnesenesenenwwnenwsewesewsesesew",
          "nenewswnwewswnenesenwnesewesw",
          "eneswnwswnwsenenwnwnwwseeswneewsenese",
          "neswnwewnwnwseenwseesewsenwsweewe",
          "wseweeenwnesenwwwswnew",
        ],
        10,
      ],
      [puzzleInput, 424],
    ])("input %#", (input, expected) => {
      const actual = part1(input);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 2", () => {
    it.each([
      [[], 0],
      [puzzleInput, 0],
    ])("input %#", (input, expected) => {
      const actual = part2(input);
      expect(actual).toStrictEqual(expected);
    });
  });
});
