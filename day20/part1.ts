import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day20/data.txt");

    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
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
                break;
            }
        }
    }

    // find all walls that can facilitate 'cheating' and count how many save at least 100 units
    let count = 0;
    for (let cellIdx = 0; cellIdx < grid.length; ++cellIdx) {
        if (grid[cellIdx] !== "#") { continue; }

        // check combinations and entry and exit points around the wall
        const adjacents = [
            getOffset(cellIdx, -1, 0), getOffset(cellIdx, 1, 0),
            getOffset(cellIdx, 0, -1), getOffset(cellIdx, 0, 1)
        ] as const;
        for (let i = 0; i < adjacents.length; ++i) {
            for (let k = 1; k < adjacents.length; ++k) {
                const [aIdx, aVal] = adjacents[i];
                const [bIdx, bVal] = adjacents[(i + k) % adjacents.length];
                if (aVal === "." && bVal === ".") {
                    const d = (distances.get(aIdx)! - distances.get(bIdx)!) - 2; // -2 because we have to expend 2 steps in order actually execute the cheat
                    if (d >= 100) {
                        ++count;
                    }
                }
            }
        }
    }

    return count;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}