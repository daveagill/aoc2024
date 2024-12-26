import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day22/data.txt");

    const prngSeeds = lines.map(BigInt);

    const allSequences = new Set<string>();
    const allSequencesToPrices = [] as Map<string, number>[];

    for (let i = 0; i < prngSeeds.length; ++i) {
        let secret = prngSeeds[i];
        const pricesAndDeltas = [] as [number, number][];
        for (let count = 0; count < 2000; ++count) {
            const priceBefore = Number(secret % 10n);
            secret = (secret ^ (secret * 64n)) % 16777216n;
            secret = (secret ^ (secret / 32n)) % 16777216n;
            secret = (secret ^ (secret * 2048n)) % 16777216n;
            const price = Number(secret % 10n);
            const delta = price - priceBefore;
            pricesAndDeltas.push([price, delta]);
        }

        // determine 4-len delta sequences and their prices
        const sequencesToPrices = new Map<string, number>();
        for (let s = 3; s < pricesAndDeltas.length; ++s) {
            const seq = `${pricesAndDeltas[s-3][1]},${pricesAndDeltas[s-2][1]},${pricesAndDeltas[s-1][1]},${pricesAndDeltas[s][1]}`;
            const price = pricesAndDeltas[s][0];
            if (!sequencesToPrices.has(seq)) {
                sequencesToPrices.set(seq, price);
                allSequences.add(seq);
            }
        }
        allSequencesToPrices.push(sequencesToPrices);
    }

    let maxBananas = 0;
    for (const seq of allSequences) {
        const numBananas = allSequencesToPrices.reduce((tot, sToP) => tot + (sToP.get(seq) ?? 0), 0);
        maxBananas = Math.max(maxBananas, numBananas);
    }

    return maxBananas;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}