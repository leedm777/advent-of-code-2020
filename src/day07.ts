import _ from "lodash";
import { sscanf } from "scanf";

const myBag = "shiny gold";

export interface LuggageRule {
  outerColor: string;
  innerColors: { [key: string]: number };
}

interface LuggageMustContain {
  [key: string]: number;
}

interface LuggageGraph {
  [key: string]: {
    canBeContainedBy: string[];
    mustContain: LuggageMustContain;
  };
}

function parseMustContain(input: string): LuggageMustContain {
  if (input === "no other bags.") {
    return {};
  }
  return (
    _(input)
      .split(/, /)
      .map((bag) => {
        const [count, mod, color] = sscanf(bag, "%d %s %s") as [
          number,
          string,
          string
        ];
        return { [`${mod} ${color}`]: count };
      })
      .reduce(_.assign) || {}
  );
}

export function parseLuggageRule(input: string): LuggageRule {
  const [outerColor, innerString] = _.split(input, " bags contain ");
  const innerColors = parseMustContain(innerString);
  return {
    outerColor,
    innerColors,
  };
}

function graphLuggage(input: string[]): LuggageGraph {
  return _(input)
    .map(parseLuggageRule)
    .reduce((acc, { outerColor, innerColors }) => {
      const canBeContainedBy = _.mapValues(innerColors, () => ({
        canBeContainedBy: [outerColor],
      }));
      return _(acc)
        .merge({ [outerColor]: { mustContain: innerColors } })
        .mergeWith(canBeContainedBy, (a, b) => {
          if (_.isArray(a)) {
            return a.concat(b);
          }
        })
        .value();
    }, {});
}

export function part1(input: string[]): number {
  const graph = graphLuggage(input);

  const canContainMyBag = new Set();
  const open = [myBag];

  let bag;
  while ((bag = open.pop())) {
    const { canBeContainedBy } = graph[bag];
    _.forEach(canBeContainedBy, (c) => {
      canContainMyBag.add(c);
      open.push(c);
    });
  }

  return canContainMyBag.size;
}

function countBags(graph: LuggageGraph, bag: string): number {
  const { mustContain } = graph[bag];
  return _(mustContain)
    .map((count, b) => count + count * countBags(graph, b))
    .sum();
}

export function part2(input: string[]): number {
  const graph = graphLuggage(input);

  return countBags(graph, myBag);
}
