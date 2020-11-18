// https://adventofcode.com/2017/day/1

import _ from "lodash";

// Original part1
// export function part1(numbers: string): number {
//   const first = numbers[0];
//   const rest = numbers.slice(1);
//
//   const r = _.reduce(
//     `${rest}${first}`,
//     ({ prior, sum }, c) => {
//       if (c === prior) {
//         return {
//           prior: c,
//           sum: sum + parseInt(c),
//         };
//       }
//       return {
//         prior: c,
//         sum,
//       };
//     },
//     {
//       prior: first,
//       sum: 0,
//     }
//   );
//
//   return r.sum;
// }

export function part1(numbers: string): number {
  return part2(numbers, 1);
}

export function part2(numbers: string, rotation = numbers.length / 2): number {
  const rot = numbers.slice(rotation) + numbers.slice(0, rotation);

  const pairs = _.zip(
    _.map(numbers, (c) => parseInt(c, 10)),
    _.map(rot, (c) => parseInt(c, 10))
  ) as [number, number][];

  return _.reduce(
    pairs,
    (sum, [n1, n2]) => {
      if (n1 === n2) {
        return sum + n1;
      }
      return sum;
    },
    0
  );
}
