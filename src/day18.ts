import _ from "lodash";

export function compute(input: string): number {
  const tokens: null | string[] = input.match(/(\d+)|([+*])|([()])/g);

  if (!tokens) {
    throw new Error("Could not tokenize");
  }

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
      stack: [] as { val: number; op: string }[],
    }
  );
  return val;
}

export function part1(input: string[]): number {
  return _(input).map(compute).sum();
}

export function compute2(input: string): number {
  // Shunting-yard: https://en.wikipedia.org/wiki/Shunting-yard_algorithm#The_algorithm_in_detail
  const tokens: null | string[] = input.match(/(\d+)|([+*])|([()])/g);
  const output: (number | string)[] = [];
  const ops: string[] = [];

  if (!tokens) {
    throw new Error("Could not tokenize");
  }

  for (const token of tokens) {
    if (token.match(/^\d+$/)) {
      output.push(parseInt(token, 10));
    } else if (token === "+" || token === "*") {
      /*
       * while ((there is an operator at the top of the operator stack)
       *      and ((the operator at the top of the operator stack has greater precedence)
       *          or (the operator at the top of the operator stack has equal precedence and the token is left associative))
       *      and (the operator at the top of the operator stack is not a left parenthesis)):
       *
       * + is the only high precedence operator, and is left associative
       */
      while (_.last(ops) === "+") {
        output.push(ops.pop() as string);
      }
      ops.push(token);
    } else if (token === "(") {
      ops.push(token);
    } else if (token === ")") {
      while (_.last(ops) !== "(") {
        output.push(ops.pop() as string);
      }

      if (_.last(ops) === "(") {
        ops.pop();
      } else {
        throw new Error("Mismatched parens");
      }
    }
  }

  while (!_.isEmpty(ops)) {
    output.push(ops.pop() as string);
  }

  const stack = _.reduce(
    output,
    (stack, t) => {
      if (_.isNumber(t)) {
        stack.push(t);
      } else if (t === "*") {
        const lhs = stack.pop() as number;
        const rhs = stack.pop() as number;
        stack.push(lhs * rhs);
      } else if (t === "+") {
        const lhs = stack.pop() as number;
        const rhs = stack.pop() as number;
        stack.push(lhs + rhs);
      }

      return stack;
    },
    [] as number[]
  );

  return stack[0];
}

export function part2(input: string[]): number {
  return _(input).map(compute2).sum();
}
