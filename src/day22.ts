import _ from "lodash";

export function playRound(
  player1: number[],
  player2: number[]
): [number[], number[]] {
  const [card1, ...next1] = player1;
  const [card2, ...next2] = player2;

  if (card1 > card2) {
    return [[...next1, card1, card2], next2];
  } else {
    return [next1, [...next2, card2, card1]];
  }
}

export function part1(input: string[][]): number {
  let [player1, player2] = _(input)
    .map(_.drop)
    .map((p) => p.map((s) => parseInt(s, 10)))
    .value();

  const numCards = _.size(player1) + _.size(player2);
  while (!_.isEmpty(player1) && !_.isEmpty(player2)) {
    [player1, player2] = playRound(player1, player2);
  }

  const score = _(player1)
    .concat(player2)
    .reverse()
    .zip(_.range(1, numCards + 1))
    .map(([c, v]) => c * v)
    .sum();

  return score;
}

export function part2(input: string[]): number {
  return 0;
}
