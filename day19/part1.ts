import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day19/data.txt");

    const availableTowels = lines[0].split(", ");
    const designs = lines.slice(2);

    const canConstructDesign = (viableTowels: string[], targetDesign:string, state:string, visited:Set<string>) : boolean => {
        if (!targetDesign.startsWith(state)) {
            return false;
        }
        if (state.length === targetDesign.length) {
            return true;
        }
        if (visited.has(state)) {
            return false;
        }

        visited.add(state);

        for (const t of viableTowels) {
            if (canConstructDesign(viableTowels, targetDesign, state + t, visited)) {
                return true;
            }
        }
        return false;
    }

    const numPossibleDesigns = designs.filter(d => {
        const viableTowels = availableTowels.filter(t => d.indexOf(t) >= 0);
        viableTowels.sort((a, b) => b.length - a.length);
        return canConstructDesign(viableTowels, d, "", new Set<string>());
    }).length;

    return numPossibleDesigns;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}