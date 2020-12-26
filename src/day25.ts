import _ from "lodash";

const subject = 7;
const sharedPrime = 20201227;

export function encrypt(subject: number, loopSize: number): number {
  let v = 1;
  for (let i = 0; i < loopSize; ++i) {
    v = (v * subject) % sharedPrime;
  }
  return v;
}

export function part1(handshake: [string, string]): number {
  const [cardPub, doorPub] = _.map(handshake, (s) => parseInt(s, 10));
  let cardLoopSize = 0;
  let v = 1;
  while (v !== cardPub) {
    ++cardLoopSize;
    v = (v * subject) % sharedPrime;
  }

  // let doorLoopSize = 0;
  // v = 1;
  // while (v !== doorPub) {
  //   ++doorLoopSize;
  //   v = (v * subject) % sharedPrime;
  // }
  // encrypt(doorPub, cardLoopSize);

  return encrypt(doorPub, cardLoopSize);
}

export function part2(input: string[]): number {
  return 0;
}
