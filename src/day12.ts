import { SideLogger } from "./aoc";

const log = new SideLogger("day12.log");
log.clear();

const forward = ["E", "S", "W", "N"];

export type Pos = [number, number];

export function rotateAbout(
  [wx, wy]: Pos,
  [x, y]: Pos,
  clockwise: number
): Pos {
  const dx = wx - x;
  const dy = wy - y;

  switch (clockwise) {
    case 90:
      return [x + dy, y - dx];
    case 180:
      return [x - dx, y - dy];
    case 270:
      return [x - dy, y + dx];
    default:
      throw new Error("Unsupported rotation");
  }
}

export function part1(input: string[]): number {
  let heading = 0;
  let x = 0;
  let y = 0;

  for (const line of input) {
    let dir = line[0];
    const mag = parseInt(line.slice(1), 0);

    if (dir === "F") {
      dir = forward[heading];
    }

    switch (dir) {
      case "N":
        y += mag;
        break;
      case "S":
        y -= mag;
        break;
      case "E":
        x += mag;
        break;
      case "W":
        x -= mag;
        break;
      case "L":
        heading = (forward.length + heading - mag / 90) % forward.length;
        break;
      case "R":
        heading = (forward.length + heading + mag / 90) % forward.length;
        break;
      default:
        throw new Error("wat?");
    }
  }

  return Math.abs(x) + Math.abs(y);
}

export function part2(input: string[]): number {
  let x = 0;
  let y = 0;
  let wx = 10;
  let wy = 1;

  for (const line of input) {
    const dir = line[0];
    const mag = parseInt(line.slice(1), 0);

    switch (dir) {
      case "N":
        wy += mag;
        break;
      case "S":
        wy -= mag;
        break;
      case "E":
        wx += mag;
        break;
      case "W":
        wx -= mag;
        break;
      case "L":
        [wx, wy] = rotateAbout([wx, wy], [x, y], 360 - mag);
        break;
      case "R":
        [wx, wy] = rotateAbout([wx, wy], [x, y], mag);
        break;
      case "F":
        {
          const dx = mag * (wx - x);
          const dy = mag * (wy - y);
          x += dx;
          y += dy;
          wx += dx;
          wy += dy;
        }
        break;
      default:
        throw new Error("wat?");
    }

    log.log(`${line}: [${x}, ${y}] [${wx}, ${wy}] [${wx - x}, ${wy - y}]`);
  }

  return Math.abs(x) + Math.abs(y);
}
