import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day5/data.txt");
    
    // split the puzzle input at the blank line
    const blankLineAt = lines.indexOf("");
    const ruleLines = lines.slice(0, blankLineAt);
    const updateLines = lines.slice(blankLineAt+1, lines.length);

    // parse the ordering rules
    const orderingRules = new Set<string>(ruleLines);

    // parse the updates
    const updates = updateLines.map(u => u.split(",").map(Number));
    
    // find valid updates
    const validUpdates = updates.filter(update => {
        // triangulaly compare each value againt values ahead of it
        for (let i = 0; i < update.length; ++i) {
            for (let k = i+1; k < update.length; ++k) {
                const rule = `${update[i]}|${update[k]}`;
                if (!orderingRules.has(rule)) {
                    return false;
                }
            }
        }
        return true;
    });

    // sum middle numbers, we know/assume these are odd in length
    let sum = 0;
    for (const update of validUpdates) {
        sum += update[(update.length-1) / 2];
    }
    
    return sum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}