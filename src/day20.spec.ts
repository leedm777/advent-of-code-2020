import { encodeSide, part1, part2, reverseBits } from "./day20";
import { readFile, splitLines } from "./aoc";

const puzzleInput = splitLines(readFile("./src/day20.txt"));

const example = [
  "Tile 2311:",
  "..##.#..#.",
  "##..#.....",
  "#...##..#.",
  "####.#...#",
  "##.##.###.",
  "##...#.###",
  ".#.#.#..##",
  "..#....#..",
  "###...#.#.",
  "..###..###",
  "",
  "Tile 1951:",
  "#.##...##.",
  "#.####...#",
  ".....#..##",
  "#...######",
  ".##.#....#",
  ".###.#####",
  "###.##.##.",
  ".###....#.",
  "..#.#..#.#",
  "#...##.#..",
  "",
  "Tile 1171:",
  "####...##.",
  "#..##.#..#",
  "##.#..#.#.",
  ".###.####.",
  "..###.####",
  ".##....##.",
  ".#...####.",
  "#.##.####.",
  "####..#...",
  ".....##...",
  "",
  "Tile 1427:",
  "###.##.#..",
  ".#..#.##..",
  ".#.##.#..#",
  "#.#.#.##.#",
  "....#...##",
  "...##..##.",
  "...#.#####",
  ".#.####.#.",
  "..#..###.#",
  "..##.#..#.",
  "",
  "Tile 1489:",
  "##.#.#....",
  "..##...#..",
  ".##..##...",
  "..#...#...",
  "#####...#.",
  "#..#.#.#.#",
  "...#.#.#..",
  "##.#...##.",
  "..##.##.##",
  "###.##.#..",
  "",
  "Tile 2473:",
  "#....####.",
  "#..#.##...",
  "#.##..#...",
  "######.#.#",
  ".#...#.#.#",
  ".#########",
  ".###.#..#.",
  "########.#",
  "##...##.#.",
  "..###.#.#.",
  "",
  "Tile 2971:",
  "..#.#....#",
  "#...###...",
  "#.#.###...",
  "##.##..#..",
  ".#####..##",
  ".#..####.#",
  "#..#.#..#.",
  "..####.###",
  "..#.#.###.",
  "...#.#.#.#",
  "",
  "Tile 2729:",
  "...#.#.#.#",
  "####.#....",
  "..#.#.....",
  "....#..#.#",
  ".##..##.#.",
  ".#.####...",
  "####.#.#..",
  "##.####...",
  "##..#.##..",
  "#.##...##.",
  "",
  "Tile 3079:",
  "#.#.#####.",
  ".#..######",
  "..#.......",
  "######....",
  "####.#..#.",
  ".#...#.##.",
  "#.#####.##",
  "..#.###...",
  "..#.......",
  "..#.###...",
];

describe("day20", () => {
  describe("encodeSide", () => {
    it.each([
      ["..........", 0],
      [".........#", 1],
      ["........#.", 2],
      ["##..#.....", 800],
    ])("%s -> %d", (side, expected) => {
      const actual = encodeSide(side);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("reverseBits", () => {
    it.each([
      [0, 0],
      [1, 512],
      [512, 1],
    ])("%d -> %d", (n, expected) => {
      const actual = reverseBits(n);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("part 1", () => {
    it.each([
      [example, 1951 * 3079 * 2971 * 1171],
      [puzzleInput, 0],
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
