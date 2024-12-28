import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day24/data.txt");

    const evalGraph = new Map<string, () => boolean>();
    const evaluate = (identifier:string) => {
        const evalFn = evalGraph.get(identifier)!;
        return evalFn();
    };

    const blankLineAt = lines.indexOf("");

    // parse the literal values
    for (let i = 0; i < blankLineAt; ++i) {
        const [identifier, value] = lines[i].split(": ");
        evalGraph.set(identifier, () => value === "1");
    }

    // parse the gates
    for (let i = blankLineAt+1; i < lines.length; ++i) {
        const [lhs, operator, rhs, _, output] = lines[i].split(" ");
        
        let opFunction;
        if (operator === "AND") {
            opFunction = () => evaluate(lhs) && evaluate(rhs);
        } else if (operator === "OR") {
            opFunction = () => evaluate(lhs) || evaluate(rhs);
        } else { // XOR
            opFunction = () => evaluate(lhs) !== evaluate(rhs);
        }

        evalGraph.set(output, opFunction);
    }

    let result = 0n;
    for (const [zOutputName, evalFn] of evalGraph.entries()) {
        if (!zOutputName.startsWith("z")) { continue; }
        const bitSignificance = BigInt(zOutputName.substring(1));
        result |= (evalFn() ? 1n : 0n) << bitSignificance;
    }

    return result;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}