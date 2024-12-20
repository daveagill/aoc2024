import { readLines } from "../helpers.ts";

type Robot = {
    x: number,
    y: number,
    vx: number,
    vy: number
}

export function part1() {
    const lines = readLines("day14/data.txt");

    const robots = lines.map(line => {
        const [x, y, vx, vy] = line.match(/-?[0-9]+/g)!.map(Number);
        return {x, y, vx, vy} as Robot;
    });
    
    const width = 101;
    const height = 103;
    const midWidth = (width-1)/2;
    const midHeight = (height-1)/2;

    // simulate robots
    const simulationDuration = 100;
    for (const r of robots) {
        const projectedX = r.x + r.vx * simulationDuration;
        const projectedY = r.y + r.vy * simulationDuration;
        r.x = (width + projectedX % width) % width;
        r.y = (height + projectedY % height) % height;
    }

    // calculate quadrant safety factors
    const topLeftScore = robots.filter(r => r.x < midWidth && r.y < midHeight).length;
    const topRightScore = robots.filter(r => r.x > midWidth && r.y < midHeight).length;
    const bottomLeftScore = robots.filter(r => r.x < midWidth && r.y > midHeight).length;
    const bottomRightScore = robots.filter(r => r.x > midWidth && r.y > midHeight).length;
    return topLeftScore * topRightScore * bottomLeftScore * bottomRightScore;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}