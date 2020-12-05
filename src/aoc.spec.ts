import _ from "lodash";
import {
  findPath,
  SideLogger,
  manhattanHeuristic,
  MinHeap,
  splitChunks,
  splitLines,
  splitNumbers,
  splitWords,
  TextGraph,
  xy,
  XYPosition,
} from "./aoc";
import { EventEmitter } from "events";

describe("aoc helper functions", () => {
  describe("splitNumbers", () => {
    describe("given some numbers", () => {
      it("should parse them into an array", () => {
        const actual = splitNumbers("1 2 3 4\n5 6 \t 7");
        expect(actual).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
      });
    });

    describe("given empty file", () => {
      it("should return empty array", () => {
        const actual = splitNumbers("");
        expect(actual).toStrictEqual([]);
      });
    });
  });

  describe("splitLines", () => {
    describe("given some lines", () => {
      it("should split them into an array", () => {
        const actual = splitLines("line 1\nline 2");
        expect(actual).toStrictEqual(["line 1", "line 2"]);
      });
    });

    describe("given empty input", () => {
      it("should return empty array", () => {
        const actual = splitLines("");
        expect(actual).toStrictEqual([]);
      });
    });
  });

  describe("splitChunks", () => {
    describe("given some chunks", () => {
      it("should split them into an array", () => {
        const actual = splitChunks("chunk 1\nline2\n\nchunk 2");
        expect(actual).toStrictEqual(["chunk 1\nline2", "chunk 2"]);
      });
    });

    describe("given empty input", () => {
      it("should return empty array", () => {
        const actual = splitChunks("");
        expect(actual).toStrictEqual([]);
      });
    });
  });

  describe("splitWords", () => {
    describe("given some words", () => {
      it("should split them into an array", () => {
        const actual = splitWords("some words.\nmore\n\nwords");
        expect(actual).toStrictEqual(["some", "words.", "more", "words"]);
      });
    });

    describe("given empty input", () => {
      it("should return empty array", () => {
        const actual = splitWords("");
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
      it("should extract it in priority order", () => {
        const max = 100;
        _(1)
          .range(max)
          .shuffle()
          .forEach((n) => uut.insert(n, n));

        _(1)
          .range(max)
          .forEach((n) => {
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
        const actual = findPath({
          graph: uut,
          start: xy(0, 0),
          goal: xy(9, 0),
        });
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
        const actual = findPath({
          graph: uut,
          start: xy(0, 0),
          goal: xy(0, 2),
        });
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
        const emitter = new EventEmitter();

        const log = new SideLogger("graph.log");
        log.clear();
        emitter.on(
          "visit",
          (
            { x, y }: XYPosition,
            open: XYPosition[],
            closed: IterableIterator<XYPosition>
          ) => {
            // an example of how to log the map; may not be
            // all that good, though.
            const grid = _.map(uut.map, (s) => _.split(s, ""));
            _.forEach(open, ({ x, y }) => {
              grid[y][x] = "o";
            });
            for (const { x, y } of closed) {
              grid[y][x] = "x";
            }
            grid[y][x] = "X";
            const printable = _(grid)
              .map((chars) => _.join(chars, ""))
              .join("\n");
            log.home();
            log.log(printable);
            log.log();
          }
        );

        const goal = xy(9, 4);
        const actual = findPath({
          graph: uut,
          start: xy(0, 0),
          goal,
          emitter,
          h: manhattanHeuristic(goal),
        });
        expect(actual).toStrictEqual([]);
      });
    });
  });
});
