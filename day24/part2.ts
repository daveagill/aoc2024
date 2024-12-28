import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day24/data.txt");

    const evalGraph = new Map<string, [string, string, string]>();

    const blankLineAt = lines.indexOf("");

    // parse the gates
    for (let i = blankLineAt+1; i < lines.length; ++i) {
        const [lhs, operator, rhs, _, output] = lines[i].split(" ");
        evalGraph.set(output, [operator, lhs, rhs]);
    }

    const isInputXORGate = ([gate, lhs, rhs]:[string, string, string]) => {
       return gate === "XOR" && ((lhs.startsWith("x") && rhs.startsWith("y")) || (lhs.startsWith("y") && rhs.startsWith("x")));
    };

    const isInputANDGate = ([gate, lhs, rhs]:[string, string, string]) => {
        return gate === "AND" && ((lhs.startsWith("x") && rhs.startsWith("y")) || (lhs.startsWith("y") && rhs.startsWith("x")));
    };

    const isLSBCarryBitANDGate = ([gate, lhs, rhs]:[string, string, string]) => {
        return gate === "AND" && ((lhs === "x00" && rhs === "y00") || (lhs === "y00" && rhs === "x00"));
    }

    const incorrectOutputs = new Set<string>();
    for (const [output, [gate, lhs, rhs]] of evalGraph.entries()) {

        // z-outputs should always be connected to an XOR gate, apart from the last one (carrybit) which is connected to an OR
        if (output.startsWith("z")) {
            const CARRYBIT_OUTPUT = "z45"; // trivially determined by inspection of the data (most significant bit z-output)
            if (!((output !== CARRYBIT_OUTPUT && gate === "XOR") || (output === CARRYBIT_OUTPUT && gate === "OR"))) {
                incorrectOutputs.add(output);
                continue;
            }
        }

        // OR gate inputs should always connect from AND gates
        if (gate === "OR") {
            const [lhsGate] = evalGraph.get(lhs)!;
            const [rhsGate] = evalGraph.get(rhs)!;
            if (lhsGate !== "AND") {
                incorrectOutputs.add(lhs);
            }
            if (rhsGate !== "AND") {
                incorrectOutputs.add(rhs);
            }
            continue;
        }

        // each full adder is comprised of two AND gates (the LSB's half-adder is comprised of only one)...
        if (gate === "AND") {
            // one AND gate is guaranteed to be connected to inputs (x and y)
            if (isInputANDGate([gate, lhs, rhs])) {
                continue;
            }

            // the other one should have inputs wired up from an XOR and an OR (carrybit) gate 
            // unless it's connected to the carrybit of the Least Significant Bit's half adder, in which case it's an AND rather than an OR gate.
            const lhsDetails = evalGraph.get(lhs)!;
            const rhsDetails = evalGraph.get(rhs)!;
            if (lhsDetails[0] !== "XOR" && lhsDetails[0] !== "OR" && !isLSBCarryBitANDGate(lhsDetails)) {
                incorrectOutputs.add(lhs);
            }
            if (rhsDetails[0] !== "XOR" && rhsDetails[0] !== "OR" && !isLSBCarryBitANDGate(rhsDetails)) {
                incorrectOutputs.add(rhs);
            }
            continue;
        }
        
        // each full adder is comprised of two XOR gates (the LSB's half affer is comprised of only one)...
        if (gate === "XOR") {
            // one XOR gate is guaranteed to be connected to inputs (x and y)
            if (isInputXORGate([gate, lhs, rhs])) {
                continue;
            }

            // XOR gates not connected to inputs should therefore be connected to outputs (z)
            if (!output.startsWith("z")) {
                incorrectOutputs.add(output);
                continue;
            }

            // these XOR gates should have inputs wired up from the preceeding XOR gate or an OR (carrybit) gate 
            // unless it's connected to the carrybit of the Least Significant Bit's half adder, in which case it's an AND rather than an OR gate.
            const lhsDetails = evalGraph.get(lhs)!;
            const rhsDetails = evalGraph.get(rhs)!;
            if (lhsDetails[0] !== "XOR" && lhsDetails[0] !== "OR" && !isLSBCarryBitANDGate(lhsDetails)) {
                incorrectOutputs.add(lhs);
            }
            if (rhsDetails[0] !== "XOR" && rhsDetails[0] !== "OR" && !isLSBCarryBitANDGate(rhsDetails)) {
                incorrectOutputs.add(rhs);
            }
            continue;
        }
    }

    return [...incorrectOutputs].sort().join(",");
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}