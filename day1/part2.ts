import { readLines, toHistogram } from "../helpers.ts";


export function part2() {
    const lines = readLines("day1/data.txt");

    const leftList = [] as number[];
    const rightList = [] as number[];

    // parse out the lists from the input
    for (const line of lines) {
        const [left, right] = line.split("   ");
        leftList.push(Number(left));
        rightList.push(Number(right));
    }

    // convert to histogram
    const rightHistogram = toHistogram(rightList);

    // calculate similarity score
    let similarity = 0;
    for (const left of leftList) {
        const right = rightHistogram.get(left) ?? 0;
        similarity += left * right;
    }

    return similarity;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}