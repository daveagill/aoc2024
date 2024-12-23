import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day17/data.txt");

    const program = lines[4]!.replace("Program: ", "").split(",").map(Number);

    const step = (regA:bigint) => {
        let regB = 0n;
        let regC = 0n;
        regB = regA % 8n; // strip off last 3 bits
        regB = regB ^ 2n; // flip middle bit
        regC = regA >> regB;
        regB = regC ^ regB;
        regB = regB ^ 7n; // flip last 3 bits
        return Number(regB % 8n);
    };

    const search = (i:number, a:bigint): bigint => {
        for (let r = 0n; r < 8n; ++r) {
            const nextRegA = (a << 3n) ^ r;
            if (step(nextRegA) === program[i]) {
                if (i == 0) { return nextRegA; }
                const result = search(i-1, nextRegA);
                if (result != -1n) {
                    return result;
                }
            }
        }
        return -1n;
    };

    return search(program.length-1, 0n);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}