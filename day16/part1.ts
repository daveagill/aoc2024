import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day16/data.txt");

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

    const startIdx = grid.indexOf('S');
    const endIdx = grid.indexOf('E');

    const queue = [];
    const scores = new Map<number, number>();
    const viaOffsets = new Map<number, [number, number]>();

    // seed the startIdx
    queue.push(startIdx);
    scores.set(startIdx, 0);
    viaOffsets.set(startIdx, [1, 0]); // we always start facing right

    while (queue.length > 0) {
        // pop from the priority queue
        queue.sort((a, b) => scores.get(a)! - scores.get(b)!);
        const currentCellIdx = queue.shift()!;
        const currentScore = scores.get(currentCellIdx)!;
        const currentViaOffset = viaOffsets.get(currentCellIdx)!;

        // stop if we reached the target
        if (currentCellIdx === endIdx) {
            break;
        }

        ([[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]).forEach(offset => {
            const [gridIdx, value] = getOffset(currentCellIdx, offset[0], offset[1]);

            // ignore walls
            if (value === '#') { return; }

            // calculate score (plus 1000 for a 90 degree turn or 2000 for a 180 degree turn)
            const isSameDirection = currentViaOffset[0] === offset[0] && currentViaOffset[1] === offset[1];
            const is90DegreeTurn = currentViaOffset[0] !== offset[0] && currentViaOffset[1] !== offset[1];
            const score = currentScore + 1 + (isSameDirection ? 0 : is90DegreeTurn ? 1000 : 2000);

            // if score has improved then enqueue for expansion
            const existingScore = scores.get(gridIdx) ?? Number.POSITIVE_INFINITY;
            if (score < existingScore) {
                queue.push(gridIdx);
                scores.set(gridIdx, score);
                viaOffsets.set(gridIdx, offset); 
            }
        });
    }

    return scores.get(endIdx)!;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}