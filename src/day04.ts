import _ from "lodash";
import { splitChunks, splitWords } from "./aoc";

/*
The automatic passport scanners are slow because they're having trouble
detecting which passports have all required fields. The expected fields are as
follows:

    byr (Birth Year)
    iyr (Issue Year)
    eyr (Expiration Year)
    hgt (Height)
    hcl (Hair Color)
    ecl (Eye Color)
    pid (Passport ID)
    cid (Country ID)

Count the number of valid passports - those that have all required fields. Treat
cid as optional. In your batch file, how many passports are valid?
 */

const requiredFields = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid" /*, "cid" */,
];

interface Field {
  name: string;
  value: string;
}

export function parsePassport(str: string): Field[] {
  return _(str)
    .thru(splitWords)
    .map((s) => {
      const [name, value] = _.split(s, ":");
      return { name, value };
    })
    .value();
}

export function hasAllFields(passport: Field[]): boolean {
  return _(requiredFields)
    .without(..._.map(passport, "name"))
    .isEmpty();
}

export function part1(input: string): number {
  return _(input)
    .thru(splitChunks)
    .map(parsePassport)
    .filter(hasAllFields)
    .size();
}

export function areAllFieldsValid(passport: Field[]): boolean {
  return _.every(passport, ({ name, value }) => {
    const num = parseInt(value, 10);
    switch (name) {
      case "byr":
        // (Birth Year) - four digits; at least 1920 and at most 2002.
        return num >= 1920 && num <= 2002;
      case "iyr":
        // (Issue Year) - four digits; at least 2010 and at most 2020.
        return num >= 2010 && num <= 2020;
      case "eyr":
        // (Expiration Year) - four digits; at least 2020 and at most 2030.
        return num >= 2020 && num <= 2030;
      case "hgt":
        // (Height) - a number followed by either cm or in:
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        return _.endsWith(value, "cm")
          ? num >= 150 && num <= 193
          : num >= 59 && num <= 76;
      case "hcl":
        // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        return value.match(/^#[0-9a-f]{6}$/);
      case "ecl":
        // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(
          value
        );
      case "pid":
        // (Passport ID) - a nine-digit number, including leading zeroes.
        return value.match(/^[0-9]{9}$/);
      case "cid":
        // (Country ID) - ignored, missing or not.
        return true;
      default:
        return true;
    }
  });
}

/*
You can continue to ignore the cid field, but each other field has strict rules
about what values are valid for automatic validation:

    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
        If cm, the number must be at least 150 and at most 193.
        If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.

Your job is to count the passports where all required fields are both present
and valid according to the above rules. Here are some example values:
 */
export function part2(input: string): number {
  return _(input)
    .thru(splitChunks)
    .map(parsePassport)
    .filter(hasAllFields)
    .filter(areAllFieldsValid)
    .size();
}
