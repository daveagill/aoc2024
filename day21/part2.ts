import { readLines } from "../helpers.ts";
import { getDPadMoves, getNumpadMoves } from "./part1.ts";

export function part2() {
    const lines = readLines("day21/data.txt");

    // takes a dpad move sequence and expands it into a dpad sequence of a dpad sequence
    const cache = new Map<string, number>();
    const getDPadSequenceLength = (dpadSequence:string, count:number) => {
        if (count == 0) { return dpadSequence.length; }
        let keyPresses = 0;
        let lastButton = "A";
        for (const nextButton of dpadSequence) {
            const cacheKey = `${lastButton}${nextButton}${count}`;
            if (cache.has(cacheKey)) {
                keyPresses += cache.get(cacheKey)!;
            } else {
                const possibleMoves = getDPadMoves(lastButton, nextButton);
                const lowestKeypresses = Math.min(...possibleMoves.map(m => getDPadSequenceLength(m, count-1)));
                keyPresses += lowestKeypresses;
                cache.set(cacheKey, lowestKeypresses);
            }
            lastButton = nextButton;
        }
        return keyPresses;
    }

    // takes a numpad code and determines the shortest chained-dpad sequence that types that code on the numpad
    const findShortestSequence = (numpadCode:string, dpadDepth:number = 25) => {
        let keyPresses = 0;
        let lastButton = "A";
        for (const nextButton of numpadCode) {
            const moveSequences = getNumpadMoves(lastButton, nextButton);
            keyPresses += Math.min(...moveSequences.map(m => getDPadSequenceLength(m, dpadDepth)));
            lastButton = nextButton;
        }
        return keyPresses;
    }

    let complexitySum = 0;
    for (const code of lines) {
        const shortestSequence = findShortestSequence(code);

        const numericPart = Number(code.match(/\d+/)![0]);
        const sequenceLength = shortestSequence;
        const complexity = sequenceLength * numericPart;
        complexitySum += complexity;
    }
    
    return complexitySum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}