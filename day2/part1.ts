import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day2/data.txt");

    let numSafe = 0;
    for (const report of lines) {
        const levels = report.split(" ").map(s => Number(s));

        // check for increasing or decreasing by a difference of up to 3.
        let increasing = true;
        let decreasing = true;
        for (let i = 1; i < levels.length; ++i) {
            const diff = levels[i] - levels[i-1];
            increasing = increasing && diff > 0 && diff <= 3;
            decreasing = decreasing && diff < 0 && diff >= -3;
        }

        if (increasing || decreasing) {
            ++numSafe;
        }
    }

    return numSafe;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}