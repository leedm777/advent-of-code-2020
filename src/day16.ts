import _ from "lodash";
import { sscanf } from "scanf";
import { makeSideLogger } from "./aoc";

type Range = [number, number];

export interface Tickets {
  fields: { [name: string]: Range[] };
  yourTicket: number[];
  nearbyTickets: number[][];
}

export function parseTickets(input: string[]): Tickets {
  const { tickets } = _.reduce(
    input,
    ({ tickets, parsing }, line) => {
      switch (parsing) {
        case "fields":
          if (_.isEmpty(line)) {
            parsing = "yourTicket";
          } else {
            // TODO: sscanf doesn't like the space in the string
            const [field, ranges] = _.split(line, ": ");
            const [min1, max1, min2, max2] = sscanf(
              ranges,
              "%d-%d or %d-%d"
            ) as [number, number, number, number];
            tickets = {
              ...tickets,
              fields: {
                ...tickets.fields,
                [field]: [
                  [min1, max1],
                  [min2, max2],
                ],
              },
            };
          }
          break;
        case "yourTicket":
          if (_.isEmpty(line)) {
            parsing = "nearbyTickets";
          } else if (!_.endsWith(line, ":")) {
            tickets = {
              ...tickets,
              yourTicket: _(line)
                .split(",")
                .map((s) => parseInt(s, 10))
                .value(),
            };
          }
          break;
        case "nearbyTickets":
          if (!_.endsWith(line, ":")) {
            tickets = {
              ...tickets,
              nearbyTickets: [
                ...tickets.nearbyTickets,
                _(line)
                  .split(",")
                  .map((s) => parseInt(s, 10))
                  .value(),
              ],
            };
          }
          break;
      }

      return { tickets, parsing };
    },
    {
      parsing: "fields",
      tickets: {
        fields: {},
        yourTicket: [],
        nearbyTickets: [],
      } as Tickets,
    }
  );
  return tickets;
}

function isValid(f: Range[], val: number) {
  return _.some(f, ([min, max]) => min <= val && val <= max);
}

export function part1(input: string[]): number {
  const tickets = parseTickets(input);

  return _(tickets.nearbyTickets)
    .flatten()
    .filter((val) => !_.some(tickets.fields, (f) => isValid(f, val)))
    .sum();
}

const log = makeSideLogger("day16.log");
log.clear();

export function processOfElimination({
  fields,
  nearbyTickets,
}: Tickets): { [name: string]: number } {
  const numFields = nearbyTickets[0].length;
  const candidates = _.mapValues(fields, () => _.range(0, numFields));

  function eliminate(field: string, idx: number) {
    log.log(`${field} ${idx}`);
    let idxes = candidates[field];
    if (idxes.length === 1) {
      if (idxes[0] === idx) {
        throw new Error("Inconsistent tickets");
      }
      // already eliminated
      return;
    }

    idxes = _.filter(idxes, (i) => i !== idx);
    candidates[field] = idxes;

    if (idxes.length === 1) {
      log.log(`${field} is ${idxes[0]}`);
      // if field only has one value; nothing else can have it
      _(candidates)
        .keys()
        .filter((k) => k !== field)
        .forEach((otherField) => eliminate(otherField, idxes[0]));
    }
  }

  _.forEach(nearbyTickets, (ticket) => {
    _.forEach(ticket, (val, idx) => {
      _(fields)
        .pickBy((f) => !isValid(f, val))
        .keys()
        .forEach((invalidField) => {
          eliminate(invalidField, idx);
        });
    });
  });
  return _.mapValues(candidates, _.first);
}

export function part2(input: string[]): number {
  log.clear();
  const tickets = parseTickets(input);

  tickets.nearbyTickets = _(tickets.nearbyTickets)
    .filter((ticket) =>
      _.every(ticket, (val) => _.some(tickets.fields, (f) => isValid(f, val)))
    )
    .value();

  const fieldIndexes = processOfElimination(tickets);
  return _(fieldIndexes)
    .pickBy((v, field) => _.startsWith(field, "departure"))
    .map((idx) => tickets.yourTicket[idx])
    .reduce(_.multiply);
}
