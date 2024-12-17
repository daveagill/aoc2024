import { part1 } from "./part1.ts";

export function part2() {
    return part1(75);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}