import _ from "lodash";

/**
 * Split a string into an array of numbers.
 *
 * @param str - String to parse.
 * @returns parsed numbers
 */
export function splitNumbers(str: string): number[] {
  return _(str)
    .split(/\s+/)
    .map((s) => parseInt(s, 10))
    .value();
}