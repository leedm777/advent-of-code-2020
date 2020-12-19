import _ from "lodash";

type Match = { matches: boolean; rem?: string };

interface Rule {
  id: number;

  match(msg: string): Match;
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
            match(str: string): Match {
              if (_.head(str) === letter) {
                return {
                  matches: true,
                  rem: _.tail(str).join(""),
                };
              }

              return {
                matches: false,
                rem: str,
              };
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
          match(str: string): Match {
            for (const branch of children) {
              const res = _.reduce(
                branch,
                ({ matches, rem }: Match, ruleId) => {
                  if (!matches || _.isNil(rem)) {
                    return {
                      matches: false,
                    };
                  }

                  return rules[ruleId].match(rem);
                },
                {
                  matches: true,
                  rem: str,
                }
              );
              if (res.matches) {
                return res;
              }
            }
            return {
              matches: false,
            };
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
      const { matches, rem } = rules[0].match(msg);
      return matches && rem === "";
    })
    .size();
}

export function part2(input: string[]): number {
  return 0;
}
