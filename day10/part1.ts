import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day10/data.txt");

    // define our grid
    const grid = lines.join('').split('').map(Number);
    const width = lines[0].length;
    const height = lines.length;
    const getOffset = (idx:number, xOffset:number, yOffset:number) => {
        const [x, y] = [idx % width + xOffset, Math.floor(idx / width) + yOffset];
        if (x < 0 || y < 0 || x >= width || y >= height) { return [-1, -1]; }
        const offsetIdx = x + y*width;
        return [offsetIdx, grid[offsetIdx]] as const;
    }

    function walkGridRecursively(idx:number, value:number, reachableNines:Set<number>) {
        if (value === 9) {
            reachableNines.add(idx);
            return;
        }

        const [northIdx, northValue] = getOffset(idx, 0, 1);
        const [eastIdx, eastValue] = getOffset(idx, 1, 0);
        const [southIdx, southValue] = getOffset(idx, 0, -1);
        const [westIdx, westValue] = getOffset(idx, -1, 0);
        
        const nextValue = value+1;
        if (northValue === nextValue) { walkGridRecursively(northIdx, nextValue, reachableNines); }
        if (eastValue  === nextValue) { walkGridRecursively(eastIdx, nextValue, reachableNines); }
        if (southValue === nextValue) { walkGridRecursively(southIdx, nextValue, reachableNines); }
        if (westValue  === nextValue) { walkGridRecursively(westIdx, nextValue, reachableNines); }
    }
 
    const trailheads = grid.map((cell, index) => cell === 0 ? index : -1).filter(cell => cell !== -1);

    return trailheads.map(idx => {
        const reachableNines = new Set<number>();
        walkGridRecursively(idx, 0, reachableNines);
        return reachableNines.size;
    }).reduce((acc, val) => acc+val);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}