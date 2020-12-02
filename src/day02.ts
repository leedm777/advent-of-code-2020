import _ from "lodash";

/**
 * To try to debug the problem, they have created a list (your puzzle input) of
 * passwords (according to the corrupted database) and the corporate policy
 * when that password was set.
 *
 * For example, suppose you have the following list:
 *
 * 1-3 a: abcde
 * 1-3 b: cdefg
 * 2-9 c: ccccccccc
 *
 * Each line gives the password policy and then the password. The password
 * policy indicates the lowest and highest number of times a given letter must
 * appear for the password to be valid. For example, 1-3 a means that the
 * password must contain a at least 1 time and at most 3 times.
 *
 * In the above example, 2 passwords are valid. The middle password, cdefg, is
 * not; it contains no instances of b, but needs at least 1. The first and
 * third passwords are valid: they contain one a or nine c, both within the
 * limits of their respective policies.
 *
 * How many passwords are valid according to their policies?
 */
export function part1(input: string[]): number {
  return _(input)
    .map((line) => {
      const [policy, password] = _.split(line, ": ");
      const [range, char] = _.split(policy, " ");
      const [min, max] = _.split(range, "-").map((s) => parseInt(s, 10));
      return { min, max, char, password };
    })
    .filter(({ min, max, char, password }) => {
      const count = _.filter(password, (c) => c === char).length;
      return min <= count && count <= max;
    })
    .size();
}

/**
 * Each policy actually describes two positions in the password, where 1 means
 * the first character, 2 means the second character, and so on. (Be careful;
 * Toboggan Corporate Policies have no concept of "index zero"!) Exactly one of
 * these positions must contain the given letter. Other occurrences of the
 * letter are irrelevant for the purposes of policy enforcement.
 */
export function part2(input: string[]): number {
  return _(input)
    .map((line) => {
      const [policy, password] = _.split(line, ": ");
      const [range, char] = _.split(policy, " ");
      const [pos1, pos2] = _.split(range, "-").map((s) => parseInt(s, 10));
      return { pos1, pos2, char, password };
    })
    .filter(({ pos1, pos2, char, password }) => {
      const ch1 = password[pos1 - 1];
      const ch2 = password[pos2 - 1];
      return (ch1 === char) !== (ch2 === char);
    })
    .size();
}
