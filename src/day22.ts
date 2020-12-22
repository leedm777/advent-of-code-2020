import _ from "lodash";
import { makeSideLogger } from "./aoc";

const log = makeSideLogger("day22.log", true);

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
    .map((p) => _.map(p, (s) => parseInt(s, 10)))
    .value();

  const numCards = _.size(player1) + _.size(player2);
  while (!_.isEmpty(player1) && !_.isEmpty(player2)) {
    [player1, player2] = playRound(player1, player2);
  }

  const score = _(player1)
    .concat(player2)
    .reverse()
    .zip(_.range(1, numCards + 1))
    .map(([c, v]: [number, number]) => c * v)
    .sum();

  return score;
}

let gameCtr = 1;

export function playRecursiveRound(
  round: number,
  game: number,
  player1: number[],
  player2: number[],
  memory = new Set<string>()
): [number[], number[], Set<string>] {
  log.log(`Game ${game}, Round ${round}:`);
  const [card1, ...next1] = player1;
  const [card2, ...next2] = player2;
  log.log(`P1 Deck: ${_.join(player1, ", ")}`);
  log.log(`P2 Deck: ${_.join(player2, ", ")}`);

  // if there was a previous round in this game that had exactly the same cards
  // in the same order in the same players' decks, the game instantly ends in a
  // win for player 1.
  const engram = _.join(player1, ",") + ";" + _.join(player2, ",");
  if (memory.has(engram)) {
    log.log("  P1 by memory");
    return [[...next1, card1, card2, ...next2], [], memory];
  }
  memory.add(engram);

  // If both players have at least as many cards remaining in their deck as the
  // value of the card they just drew, the winner of the round is determined by
  // playing a new game of Recursive Combat
  if (card1 <= next1.length && card2 <= next2.length) {
    log.log("  Playing subgame...");
    let sub1 = _.slice(next1, 0, card1);
    let sub2 = _.slice(next2, 0, card2);
    const subMemory = new Set<string>();
    const subGame = ++gameCtr;

    log.log("");
    let subRound = 0;
    while (!_.isEmpty(sub1) && !_.isEmpty(sub2)) {
      [sub1, sub2] = playRecursiveRound(
        ++subRound,
        subGame,
        sub1,
        sub2,
        subMemory
      );
    }

    if (_.isEmpty(sub2)) {
      log.log("  P1 by subgame");
      return [[...next1, card1, card2], next2, memory];
    } else {
      log.log("  P2 by subgame");
      return [next1, [...next2, card2, card1], memory];
    }
  }

  // Otherwise, at least one player must not have enough cards left in their
  // deck to recurse; the winner of the round is the player with the
  // higher-value card.
  if (card1 > card2) {
    log.log("  P1 by card");
    return [[...next1, card1, card2], next2, memory];
  } else {
    log.log("  P2 by card");
    return [next1, [...next2, card2, card1], memory];
  }
}

export function part2(input: string[][]): number {
  log.clear();
  gameCtr = 1;
  let [player1, player2] = _(input)
    .map(_.drop)
    .map((p) => _.map(p, (s) => parseInt(s, 10)))
    .value();

  const numCards = _.size(player1) + _.size(player2);
  const memory = new Set<string>();
  let round = 0;
  while (!_.isEmpty(player1) && !_.isEmpty(player2)) {
    [player1, player2] = playRecursiveRound(
      ++round,
      1,
      player1,
      player2,
      memory
    );
  }

  // return { player1, player2 };

  const score = _(player1)
    .concat(player2)
    .reverse()
    .zip(_.range(1, numCards + 1))
    .map(([c, v]: [number, number]) => c * v)
    .sum();

  return score;
}
