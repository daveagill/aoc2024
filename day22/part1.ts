import { readLines } from "../helpers.ts";


export function part1() {
    const lines = readLines("day22/data.txt");

    const prngSeeds = lines.map(BigInt);

    for (let count = 0; count < 2000; ++count) {
        for (let i = 0; i < prngSeeds.length; ++i) {
            prngSeeds[i] = (prngSeeds[i] ^ (prngSeeds[i] * 64n)) % 16777216n;
            prngSeeds[i] = (prngSeeds[i] ^ (prngSeeds[i] / 32n)) % 16777216n;
            prngSeeds[i] = (prngSeeds[i] ^ (prngSeeds[i] * 2048n)) % 16777216n;
        }
    }

    return prngSeeds.reduce((acc, val) => acc + val);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}