import { readLines } from "../helpers.ts";

function permute(state:string, h:string, hCount:number, v:string, vCount:number): string[] {
    if (hCount === 0 && vCount === 0) { return [state]; }
    return [
        ...(hCount >= 1 ? permute(state + h, h, hCount-1, v, vCount) : []),
        ...(vCount >= 1 ? permute(state + v, h, hCount, v, vCount-1) : [])
    ];
}

// determines dpad movements between two points on the numpad:
// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+
export function getNumpadMoves(start:string, end:string) {
    if (start === end) { return ["A"]; }
    if (start === "0" && end === "A") { return [">A"]; }
    if (start === "A" && end === "0") { return ["<A"]; }

    const startNum = start === "0" ? 2 : start === "A" ? 3 : Number(start);
    const endNum = end === "0" ? 2 : end === "A" ? 3 : Number(end);

    const startX = (startNum-1) % 3;
    const startY = Math.floor((startNum-1) / 3);

    const endX = (endNum-1) % 3;
    const endY = Math.floor((endNum-1) / 3);

    const horizontalMovementType = (endX > startX ? ">" : "<");
    const verticalMovementType = (endY > startY || start === "0" || start === "A" ? "^" : "v");
    const numHorizontalMovements = Math.abs(endX - startX);
    const numVerticalMovements = Math.abs(endY - startY) + (start === "0" || end === "0" || start === "A" || end === "A" ? 1 : 0);
   
    const movements = permute("", horizontalMovementType, numHorizontalMovements, verticalMovementType, numVerticalMovements);

    // there are some illegal moves through the gap we need to exclude
    return movements.filter(m => !(
        start === "7" && m.startsWith("vvv") ||
        start === "4" && m.startsWith("vv") ||
        start === "1" && m.startsWith("v") ||
        start === "0" && m.startsWith("<") ||
        start === "A" && m.startsWith("<<"))
    ).map(m => m + "A");
}

// determines dpad movements between two points on the dpad
//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+
export function getDPadMoves(start:string, end:string) {
    if (start === end) { return ["A"]; }
    switch (start + end) {
        case "^A": return [">A"];
        case "^<": return ["v<A"];
        case "^v": return ["vA"];
        case "^>": return ["v>A"];

        case "A^": return ["<A"];
        case "A<": return ["v<<A", "<v<A"];
        case "Av": return ["v<A", "<vA"];
        case "A>": return ["vA"];

        case "<^": return [">^A"];
        case "<A": return [">>^A", ">^>A"];
        case "<v": return [">A"];
        case "<>": return [">>A"];

        case "v^": return ["^A"];
        case "vA": return [">^A", "^>A"];
        case "v<": return ["<A"];
        case "v>": return [">A"];

        case ">^": return ["^<A", "<^A"];
        case ">A": return ["^A"];
        case "><": return ["<<A"];
        case ">v": return ["<A"];
    }
    throw "NEVER GONNA GIVE YOU UP, NEVER GONNA LET YOU DOWN: " + start + end;
}

export function part1() {
    const lines = readLines("day21/data.txt");

    // takes a dpad move sequence and expands it into a dpad sequence of a dpad sequence
    const expandDPadSequence = (dpadSequence:string) => {
        let output = [""];
        let lastButton = "A";
        for (const nextButton of dpadSequence) {
            const possibleMoves = getDPadMoves(lastButton, nextButton);
            output = output.flatMap(s => possibleMoves.map(m => s+m));
            lastButton = nextButton;
        }
        return output;
    }

    // takes a numpad code and determines the shortest chained-dpad sequence that types that code on the numpad
    const findShortestSequence = (numpadCode:string) => {
        let output = "";
        let lastButton = "A";
        for (const nextButton of numpadCode) {
            const moveSequences = getNumpadMoves(lastButton, nextButton).flatMap(expandDPadSequence).flatMap(expandDPadSequence);

            const minLength = moveSequences.reduce((min, moves) => Math.min(min, moves.length), Number.POSITIVE_INFINITY);
            const shortestSequence = moveSequences.find(m => m.length === minLength)!;
            output += shortestSequence;

            lastButton = nextButton;
        }
        return output;
    }

    let complexitySum = 0;
    for (const code of lines) {
        const shortestSequence = findShortestSequence(code);

        const numericPart = Number(code.match(/\d+/)![0]);
        const sequenceLength = shortestSequence.length;
        const complexity = sequenceLength * numericPart;
        complexitySum += complexity;
    }
    
    return complexitySum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}