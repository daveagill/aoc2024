import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day12/data.txt");
    
    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const getOffset = (idx:number, xOffset:number, yOffset:number) => {
        const [x, y] = [idx % width + xOffset, Math.floor(idx / width) + yOffset];
        if (x < 0 || y < 0 || x >= width || y >= height) { return [-1, ''] as const; }
        const offsetIdx = x + y*width;
        return [offsetIdx, grid[offsetIdx]] as const;
    }

    // keeps track of visited cells
    const visited = new Set<number>();

    const crawlRegion = (seedIdx:number, cell:string) => {
        const region = [];
        const queue = [[seedIdx, cell] as const];
        while (queue.length > 0) {
            const [idx, value] = queue.shift()!;

            if (value === cell && !visited.has(idx)) {
                visited.add(idx);
                region.push(idx);

                queue.push(getOffset(idx, 0, 1));
                queue.push(getOffset(idx, 1, 0));
                queue.push(getOffset(idx, 0, -1));
                queue.push(getOffset(idx, -1, 0));
            }
        }
        return region;
    }

    let totalFencingCost = 0;
    for (const [idx, cell] of grid.entries()) {
        if (visited.has(idx)) { continue; }

        const region = crawlRegion(idx, cell);

        const area = region.length;
        const sides = region.reduce((acc, idx) => {
            const isTopLeftExteriorCorner =
                getOffset(idx, 0, 1)[1] !== cell &&
                getOffset(idx, -1, 0)[1] !== cell;

            const isBottomRightExteriorCorner =
                getOffset(idx, 1, 0)[1] !== cell &&
                getOffset(idx, 0, -1)[1] !== cell;

            const isBottomLeftInteriorCorner =
                getOffset(idx, 0, 1)[1] === cell &&
                getOffset(idx, 1, 0)[1] === cell &&
                getOffset(idx, 1, 1)[1] !== cell;

            const isTopRightInteriorCorner =
                getOffset(idx, 0, -1)[1] === cell &&
                getOffset(idx, -1, 0)[1] === cell &&
                getOffset(idx, -1, -1)[1] !== cell;

            return acc +
                (isTopLeftExteriorCorner ? 2 : 0) +
                (isBottomRightExteriorCorner ? 2 : 0) +
                (isBottomLeftInteriorCorner ? 2 : 0) +
                (isTopRightInteriorCorner ? 2 : 0);
        }, 0);

        totalFencingCost += area * sides;
    }

    return totalFencingCost;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}