import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day19/data.txt");

    const availableTowels = lines[0].split(", ");
    const designs = lines.slice(2);

    const countWaysToConstructDesign = (viableTowels: string[], targetDesign:string, state:string, solutions:Map<string, number>) : number => {
        if (!targetDesign.startsWith(state)) {
            return 0;
        }
        if (state.length === targetDesign.length) {
            return 1;
        }

        const previousSolutionCount = solutions.get(state);
        if (previousSolutionCount !== undefined) {
            return previousSolutionCount;
        }

        const numSolutions = viableTowels.reduce(
            (total, towel) => total + countWaysToConstructDesign(viableTowels, targetDesign, state + towel, solutions), 0);
        
        solutions.set(state, numSolutions);
        return numSolutions;
    }

    const numArrangements = designs.reduce((total, design) => {
        const viableTowels = availableTowels.filter(t => design.indexOf(t) >= 0);
        viableTowels.sort((a, b) => b.length - a.length);
        return total + countWaysToConstructDesign(viableTowels, design, "", new Map<string, number>());
    }, 0);

    return numArrangements;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}