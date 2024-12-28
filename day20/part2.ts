import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day20/data.txt");

    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const indexToXY = (idx:number) => [idx % width, Math.floor(idx / width)] as const;
    const getOffset = (idx:number, xOffset:number, yOffset:number) => {
        const [x, y] = [idx % width + xOffset, Math.floor(idx / width) + yOffset];
        if (x < 0 || y < 0 || x >= width || y >= height) { return [-1, ""] as const; }
        const offsetIdx = x + y*width;
        return [offsetIdx, grid[offsetIdx]] as const;
    }

    const startIdx = grid.indexOf('S');
    const endIdx = grid.indexOf('E');

    // for simplicity let's erase the S and E from the grid so we only need deal in dots
    grid[startIdx] = ".";
    grid[endIdx] = ".";

    // walk the path and record distances along the way
    const distances = new Map<number, number>();
    distances.set(startIdx, 0);
    const path = [startIdx];
    let currentIdx = startIdx;
    let previousIdx = startIdx;
    let currentDistance = 0;
    while (currentIdx != endIdx) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const [idx, value] = getOffset(currentIdx, dx, dy);
            if (value === "." && idx != previousIdx) { 
                previousIdx = currentIdx;
                currentIdx = idx;
                distances.set(currentIdx, ++currentDistance);
                path.push(currentIdx);
                break;
            }
        }
    }

    // find cheats by comparing every pair of cells on the main route,
    // if the manhattan-distance between them is 20 or less then they are a viable cheat
    // count how many save at least 100 units
    let count = 0;
    for (let a = 0; a < path.length; ++a) {
        for (let b = a+1; b < path.length; ++b) {
            const aIdx = path[a];
            const bIdx = path[b];
            const aXY = indexToXY(aIdx);
            const bXY = indexToXY(bIdx);
            const manhattanDistance = Math.abs(aXY[0] - bXY[0]) + Math.abs(aXY[1] - bXY[1]);
            if (manhattanDistance >= 2 && manhattanDistance <= 20) {
                const timeSaved = Math.abs(distances.get(bIdx)! - distances.get(aIdx)!) - manhattanDistance;
                if (timeSaved >= 100) {
                    ++count;
                }
            }
        }
    }

    return count;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}