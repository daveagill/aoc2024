import { toHistogram } from "../helpers.ts";

export function part1(numBlinks:number = 25) {
    const stones = Deno.readTextFileSync("day11/data.txt").split(" ");

    // define our histogram of stone values
    const stonesHistogram = toHistogram(stones);
    const increment = (k:string, amount:number) => stonesHistogram.set(k, (stonesHistogram.get(k) ?? 0) + amount);
    const decrement = (k:string, amount:number) => increment(k, -amount);

    for (let i = 0; i < numBlinks; ++i) {

        const stateThisRound = [...stonesHistogram.entries()];
        for (const [stone, count] of stateThisRound) {
            if (count == 0) { continue; }

            decrement(stone, count);

            if (stone === "0") {
                increment("1", count);
            }
            else if (stone.length % 2 == 0) {
                const left = Number(stone.slice(0, stone.length / 2)).toString();
                const right = Number(stone.slice(stone.length / 2)).toString();
                increment(left, count);
                increment(right, count);
            }
            else {
                increment((Number(stone) * 2024).toString(), count);
            }
        }

    }

    return stonesHistogram.values().reduce((acc, val) => acc+val);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}