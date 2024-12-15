import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day4/data.txt");
    const CHARS = "XMAS".split('');

    // build a grid and accessor function
    const grid = lines.join('');
    const width = lines[0].length;
    const height = lines.length;
    const charAt = (x:number, y:number) => x >= width || x < 0 ? '' : (y >= height || y < 0 ? '' : grid[x + y * width]);

    // util to check a word against the grid
    const checkWord = (chars:string[], x:number, y:number, xStep:number, yStep:number) =>
        chars.every((char, index) =>
            charAt(x + index * xStep, y + index * yStep) === char
        );

    let count = 0;
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            count += checkWord(CHARS, x, y, 1, 0) ? 1 : 0;
            count += checkWord(CHARS, x, y, -1, 0) ? 1 : 0;
            count += checkWord(CHARS, x, y, 0, 1) ? 1 : 0;
            count += checkWord(CHARS, x, y, 0, -1) ? 1 : 0;
            count += checkWord(CHARS, x, y, 1, 1) ? 1 : 0;
            count += checkWord(CHARS, x, y, -1, 1) ? 1 : 0;
            count += checkWord(CHARS, x, y, 1, -1) ? 1 : 0;
            count += checkWord(CHARS, x, y, -1, -1) ? 1 : 0;
        }
    }

    return count;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}