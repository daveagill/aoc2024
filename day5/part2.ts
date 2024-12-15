import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day5/data.txt");
    
    // split the puzzle input at the blank line
    const blankLineAt = lines.indexOf("");
    const ruleLines = lines.slice(0, blankLineAt);
    const updateLines = lines.slice(blankLineAt+1, lines.length);

    // parse the ordering rules
    const orderingRules = new Set<string>(ruleLines);

    // parse the updates
    const updates = updateLines.map(u => u.split(",").map(Number));
    
    // find invalid updates
    const invalidUpdates = updates.filter(update => {
        // triangulaly compare each value againt values ahead of it
        for (let i = 0; i < update.length; ++i) {
            for (let k = i+1; k < update.length; ++k) {
                const rule = `${update[i]}|${update[k]}`;
                if (!orderingRules.has(rule)) {
                    return true;
                }
            }
        }
        return false;
    });

    // re-sort them into correct order
    for (const update of invalidUpdates) {
        update.sort((a, b) => {
            const rule = `${a}|${b}`;
            return orderingRules.has(rule) ? -1 : 1;
        });
    }

    // sum middle numbers, we know/assume these are odd in length
    let sum = 0;
    for (const update of invalidUpdates) {
        sum += update[(update.length-1) / 2];
    }
    
    return sum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}