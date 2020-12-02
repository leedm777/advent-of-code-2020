import { splitLines, splitNumbers } from "./aoc";

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
});
