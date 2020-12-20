import _ from "lodash";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day19.log");
log.clear();

interface Rule {
  id: number;

  match(msg: string): string[];
}

function parseRules(rulesStrs: string[]): Rule[] {
  const rules = _(rulesStrs)
    .map((s) => _.split(s, ": "))
    .map(
      ([idStr, rule]): Rule => {
        const id = parseInt(idStr, 10);
        const hasLetter = rule.match(/^"([a-z])"$/);
        if (hasLetter) {
          const letter = hasLetter[1];
          return {
            id,
            match(str: string): string[] {
              if (_.head(str) === letter) {
                log.log(`  MATCH ${id} (${letter}) (${str})`);
                return [_.tail(str).join("")];
              }

              return [];
            },
          };
        }

        const children = _(rule)
          .split(" | ")
          .map((s) =>
            _(s)
              .split(" ")
              .map((s) => parseInt(s, 10))
              .value()
          )
          .value();

        return {
          id,
          match(str: string): string[] {
            log.log(`TESTING ${id} ${JSON.stringify(children)} (${str}) `);
            return _.flatMap(children, (branch): string[] => {
              log.log(`  branch ${JSON.stringify(branch)}`);
              return _.reduce(
                branch,
                (matches: string[], ruleId) => {
                  return _.flatMap(matches, (rem) => rules[ruleId].match(rem));
                },
                [str]
              );
            });
          },
        };
      }
    )
    .reduce((rules: Rule[], rule: Rule) => {
      rules[rule.id] = rule;
      return rules;
    }, []);

  return rules;
}

export function part1(input: string[]): number {
  const rulesStrs = _.takeWhile(input, (s) => s !== "");
  const msgs = _(input)
    .dropWhile((s) => s !== "")
    .drop()
    .value();

  const rules = parseRules(rulesStrs);

  return _(msgs)
    .filter((msg) => {
      const matches = rules[0].match(msg);
      log.log(`matches => ${JSON.stringify(matches)}`);
      return _.includes(matches, "");
    })
    .size();
}

export function part2(input: string[]): number {
  const rulesStrs = _(input)
    .takeWhile((s) => s !== "")
    .map((s) => {
      switch (s) {
        case "8: 42":
          return "8: 42 | 42 8";
        case "11: 42 31":
          return "11: 42 31 | 42 11 31";
        default:
          return s;
      }
    })
    .value();

  const msgs = _(input)
    .dropWhile((s) => s !== "")
    .drop()
    .value();

  const rules = parseRules(rulesStrs);

  return _(msgs)
    .filter((msg) => {
      const matches = rules[0].match(msg);
      log.log(`matches => ${JSON.stringify(matches)}`);
      return _.includes(matches, "");
    })
    .size();
}
