import _ from "lodash";
import {
  findPath,
  MinHeap,
  splitLines,
  splitNumbers,
  TextGraph,
  xy,
} from "./aoc";

describe("aoc helper functions", () => {
  describe("splitNumbers", () => {
    describe("given some numbers", () => {
      it("should parse them into an array", async () => {
        const actual = splitNumbers("1 2 3 4\n5 6 \t 7");
        expect(actual).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
      });
    });

    describe("given empty file", () => {
      it("should return empty array", async () => {
        const actual = splitNumbers("");
        expect(actual).toStrictEqual([]);
      });
    });
  });

  describe("splitLines", () => {
    describe("given some lines", () => {
      it("should split them into an array", async () => {
        const actual = splitLines("line 1\nline 2");
        expect(actual).toStrictEqual(["line 1", "line 2"]);
      });
    });

    describe("given empty input", () => {
      it("should return empty array", async () => {
        const actual = splitLines("");
        expect(actual).toStrictEqual([]);
      });
    });
  });

  describe("MinHeap", () => {
    let uut: MinHeap<number>;
    beforeEach(() => {
      uut = new MinHeap();
    });

    describe("given some data", () => {
      it("should extract it in priority order", async () => {
        const max = 100;
        _(_.range(1, max))
          .shuffle()
          .forEach((n) => uut.insert(n, n));

        _.range(1, max).forEach((n) => {
          const actual = uut.extract();
          expect(actual).toStrictEqual(n);
        });
      });
    });
  });

  describe("TextGraph", () => {
    let uut: TextGraph;
    beforeEach(() => {
      uut = new TextGraph([
        "..........",
        "#########.",
        "..........",
        "........##",
        "........#.",
      ]);
    });

    it.each([
      // top left corner
      [xy(0, 0), [xy(1, 0)]],
      // top right corner
      [xy(9, 0), [xy(8, 0), xy(9, 1)]],
      // bottom right corner
      [xy(9, 4), []],
      // in the middle
      [xy(1, 3), [xy(2, 3), xy(0, 3), xy(1, 4), xy(1, 2)]],
      // off the grid
      [xy(1234234, 89898), []],
    ])("case %#", (p, expected) => {
      const actual = uut.getNeighbors(p);
      expect(actual).toStrictEqual(expected);
    });

    describe("findPath", () => {
      it("should compute a straight line", async () => {
        const actual = findPath(uut, xy(0, 0), xy(9, 0));
        expect(actual).toStrictEqual([
          xy(0, 0),
          xy(1, 0),
          xy(2, 0),
          xy(3, 0),
          xy(4, 0),
          xy(5, 0),
          xy(6, 0),
          xy(7, 0),
          xy(8, 0),
          xy(9, 0),
        ]);
      });

      it("should go around corners", async () => {
        const actual = findPath(uut, xy(0, 0), xy(0, 2));
        expect(actual).toStrictEqual([
          xy(0, 0),
          xy(1, 0),
          xy(2, 0),
          xy(3, 0),
          xy(4, 0),
          xy(5, 0),
          xy(6, 0),
          xy(7, 0),
          xy(8, 0),
          xy(9, 0),
          xy(9, 1),
          xy(9, 2),
          xy(8, 2),
          xy(7, 2),
          xy(6, 2),
          xy(5, 2),
          xy(4, 2),
          xy(3, 2),
          xy(2, 2),
          xy(1, 2),
          xy(0, 2),
        ]);
      });

      it("should realize when there's no path", async () => {
        const actual = findPath(uut, xy(0, 0), xy(9, 4));
        expect(actual).toStrictEqual([]);
      });
    });
  });
});
