import { SideLogger } from "./aoc";

const log = new SideLogger("day12.log");
log.clear();

const forward = ["E", "S", "W", "N"];

export type Pos = [number, number];

export function rotateAbout([dx, dy]: Pos, clockwise: number): Pos {
  switch (clockwise) {
    case 90:
      return [dy, -dx];
    case 180:
      return [-dx, -dy];
    case 270:
      return [-dy, dx];
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
  let dx = 10;
  let dy = 1;

  for (const line of input) {
    const dir = line[0];
    const mag = parseInt(line.slice(1), 0);

    switch (dir) {
      case "N":
        dy += mag;
        break;
      case "S":
        dy -= mag;
        break;
      case "E":
        dx += mag;
        break;
      case "W":
        dx -= mag;
        break;
      case "L":
        [dx, dy] = rotateAbout([dx, dy], 360 - mag);
        break;
      case "R":
        [dx, dy] = rotateAbout([dx, dy], mag);
        break;
      case "F":
        x += mag * dx;
        y += mag * dy;
        break;
      default:
        throw new Error("wat?");
    }

    log.log(`${line}: [${x}, ${y}] [${dx}, ${dy}]`);
  }

  return Math.abs(x) + Math.abs(y);
}
