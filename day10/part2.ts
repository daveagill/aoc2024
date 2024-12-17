import { readLines } from "../helpers.ts";

export function part2() {
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

    function walkGridRecursively(idx:number, value:number): number {
        if (value === 9) {
            return 1;
        }

        const [northIdx, northValue] = getOffset(idx, 0, 1);
        const [eastIdx, eastValue] = getOffset(idx, 1, 0);
        const [southIdx, southValue] = getOffset(idx, 0, -1);
        const [westIdx, westValue] = getOffset(idx, -1, 0);
        
        const nextValue = value+1;
        return (northValue === nextValue ? walkGridRecursively(northIdx, nextValue) : 0) +
               (eastValue  === nextValue ? walkGridRecursively(eastIdx, nextValue) : 0) +
               (southValue === nextValue ? walkGridRecursively(southIdx, nextValue) : 0) +
               (westValue  === nextValue ? walkGridRecursively(westIdx, nextValue) : 0);
    }
 
    const trailheads = grid.map((cell, index) => cell === 0 ? index : -1).filter(cell => cell !== -1);

    return trailheads.map(idx => walkGridRecursively(idx, 0)).reduce((acc, val) => acc+val);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}