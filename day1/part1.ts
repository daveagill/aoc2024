import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day1/data.txt");

    const leftList = [] as number[];
    const rightList = [] as number[];

    // parse out the lists from the input
    for (const line of lines) {
        const [left, right] = line.split("   ");
        leftList.push(Number(left));
        rightList.push(Number(right));
    }

    // in-place sort
    leftList.sort();
    rightList.sort();

    // sum the deltas
    let sum = 0;
    for (let i = 0; i < leftList.length; ++i) {
        sum += Math.abs(leftList[i] - rightList[i]);
    }

    return sum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}