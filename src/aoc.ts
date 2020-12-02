import _ from "lodash";
import fs from "fs";

/**
 * Split a string into an array of numbers.
 *
 * @param str - String to parse.
 * @returns parsed numbers
 */
export function splitNumbers(str: string): number[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _(str)
    .split(/\s+/)
    .map((s) => parseInt(s, 10))
    .value();
}

/**
 * Split a string into its lines.
 *
 * @param str - String to split.
 * @returns Array of strings for the lines in `str`.
 */
export function splitLines(str: string): string[] {
  str = _.trim(str);
  if (str === "") {
    return [];
  }
  return _.split(str, "\n");
}

/**
 * Read file as a UTF-8 string.
 *
 * @param name - Name of file to read.
 * @returns Contents of the file.
 */
export function readFile(name: string): string {
  return fs.readFileSync(name, "utf-8").trim();
}
