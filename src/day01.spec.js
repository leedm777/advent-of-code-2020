import day01 from "./day01.js";

describe("Day 1 solution", () => {
  it("should run tests", () => {
    const actual = day01(1);
    console.log(`answer: ${actual}`);
    expect(actual).toStrictEqual(1);
  });
});
