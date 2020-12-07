import _ from "lodash";
import { sscanf } from "scanf";

const myBag = "shiny gold";

export interface LuggageRule {
  outerColor: string;
  innerColors: { [key: string]: number };
}

function parseInnerColors(input: string) {
  if (input === "no other bags.") {
    return {};
  }
  return _(input)
    .split(/, /)
    .map((bag) => {
      const [count, mod, color] = sscanf(bag, "%d %s %s") as [
        number,
        string,
        string
      ];
      return { [`${mod} ${color}`]: count };
    })
    .reduce(_.assign) as { [key: string]: number };
}

export function parseLuggageRule(input: string): LuggageRule {
  const [outerColor, innerString] = _.split(input, " bags contain ");
  const innerColors = parseInnerColors(innerString);
  return {
    outerColor,
    innerColors,
  };
}

interface LuggageGraph {
  [key: string]: {
    canBeContainedBy: string[];
    mustContain: { [key: string]: number };
  };
}

function graphLuggage(input: string[]): LuggageGraph {
  return _(input)
    .map(parseLuggageRule)
    .reduce((acc, { outerColor, innerColors }) => {
      _.set(acc, `${outerColor}.mustContain`, innerColors);
      _.forEach(innerColors, (count, innerColor) => {
        const canBeContainedBy = _.get(
          acc,
          `${innerColor}.canBeContainedBy`,
          []
        );
        canBeContainedBy.push(outerColor);
        _.set(acc, `${innerColor}.canBeContainedBy`, canBeContainedBy);
      });
      return acc;
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
