import _ from "lodash";

export function compute(input: string): number {
  const tokens: null | string[] = input.match(/(\d+)|([+*])|([()])/g);
  const { val } = _.reduce(
    tokens,
    ({ val, op, stack }, token) => {
      switch (token) {
        case "(":
          return {
            val: 0,
            op: "+",
            stack: [{ val, op }, ...stack],
          };
        case ")": {
          const [next, ...rest] = stack;
          if (next.op === "+") {
            return {
              val: val + next.val,
              op: null,
              stack: rest,
            };
          } else if (next.op === "*") {
            return {
              val: val * next.val,
              op: null,
              stack: rest,
            };
          } else {
            throw new Error(`Unknown operator ${op}`);
          }
        }
        case "+":
        case "*":
          return {
            val,
            op: token,
            stack,
          };
        default:
          if (op === "+") {
            return {
              val: val + parseInt(token, 10),
              op: null,
              stack,
            };
          } else if (op === "*") {
            return {
              val: val * parseInt(token, 10),
              op: null,
              stack,
            };
          } else {
            throw new Error(`Unknown operator ${op}`);
          }
          break;
      }
    },
    {
      val: 0,
      op: "+",
      stack: [],
    }
  );
  return val;
}

export function part1(input: string[]): number {
  return _(input).map(compute).sum();
}

const types = {
  Constant: "Constant",
  Operator: "Operator",
  LeftParen: "LeftParen",
  RightParen: "RightParen",
};

export function compute2(input: string): number {
  const tokens: null | string[] = input.match(/(\d+)|([+*])|([()])/g);
}

export function part2(input: string[]): number {
  return _(input).map(compute2).sum();
}
