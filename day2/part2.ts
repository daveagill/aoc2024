import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day2/data.txt");

    let numSafe = 0;
    for (const report of lines) {
        const allLevels = report.split(" ").map(s => Number(s));

        // loop through variants with a single element skipped
        for (let skipIdx = 0; skipIdx < allLevels.length; ++skipIdx) {
            // prepare a levels variant with the skipped element missing
            const levels = allLevels.toSpliced(skipIdx, 1);

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
                break; // we found a good variant
            }
        }
    }

    return numSafe;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}