import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day4/data.txt");
    const WORD = "MAS";
    const WORD_REVERSED = WORD.split('').reverse().join('');

    // build a grid and accessor function
    const grid = lines.join('');
    const width = lines[0].length;
    const height = lines.length;
    const charAt = (x:number, y:number) => x >= width || x < 0 ? '' : (y >= height || y < 0 ? '' : grid[x + y * width]);

    let count = 0;
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const center = charAt(x, y);
            const topLeft = charAt(x-1, y-1);
            const topRight = charAt(x+1, y-1);
            const bottomleft = charAt(x-1, y+1);
            const bottomRight = charAt(x+1, y+1);
            
            const backDiagonal = topLeft + center + bottomRight;
            const forwardDiagonal = topRight + center + bottomleft;

            if ( (backDiagonal === WORD || backDiagonal === WORD_REVERSED) &&
                 (forwardDiagonal === WORD || forwardDiagonal === WORD_REVERSED) ) {
                count += 1;
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