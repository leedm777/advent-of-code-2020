import _ from "lodash";

/*
The first 7 characters will either be F or B; these specify exactly one of the
128 rows on the plane (numbered 0 through 127). Each letter tells you which half
 of a region the given seat is in. Start with the whole list of rows; the first
 letter indicates whether the seat is in the front (0 through 63) or the back
 (64 through 127). The next letter indicates which half of that region the seat
  is in, and so on until you're left with exactly one row.


The last three characters will be either L or R; these specify exactly one of
 the 8 columns of seats on the plane (numbered 0 through 7). The same process
  as above proceeds again, this time with only three steps. L means to keep the
   lower half, while R means to keep the upper half.
 */
export function computeSeatId(code: string): number {
  return _.reduce(
    code,
    (id: number, ch: string) => {
      let nextCode = id << 1;
      if (ch === "B" || ch === "R") {
        nextCode = nextCode | 1;
      }
      return nextCode;
    },
    0
  );
}

export function part1(input: string[]): number | undefined {
  return _(input).map(computeSeatId).max();
}

export function part2(input: string[]): number {
  const seats = _(input).map(computeSeatId).sortBy().value();
  let prior = seats[0];
  for (let i = 1; i < seats.length; ++i) {
    if (seats[i] !== prior + 1) {
      return prior + 1;
    }
    prior = seats[i];
  }
  return NaN;
}
