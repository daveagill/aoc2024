import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day17/data.txt");

    const program = lines[4]!.replace("Program: ", "").split(",").map(Number);
    let regA = Number(lines[0]!.match(/\d+/)![0]);
    let regB = Number(lines[1]!.match(/\d+/)![0]);
    let regC = Number(lines[2]!.match(/\d+/)![0]);
    let programPointer = 0;
    let jumped = false;
    const output = [] as number[];

    const readComboOperand = (operand:number) => {
        if (operand >= 0 && operand <= 3) { return operand; }
        if (operand === 4) { return regA; }
        if (operand === 5) { return regB; }
        if (operand === 6) { return regC; }
        throw new Error("Invalid operand: " + operand);
    };

    const runInstruction = (opcode:number, operand:number) => {
        jumped = false;
        switch (opcode) {
            case 0: // adv
                regA = Math.trunc(regA / Math.pow(2, readComboOperand(operand)));
                break;
            case 1: // bxl
                regB = regB ^ operand;
                break;
            case 2: // bst
                regB = readComboOperand(operand) % 8;
                break;
            case 3: // jnz
                if (regA !== 0) {
                    programPointer = operand;
                    jumped = true;
                }
                break;
            case 4: // bxc
                regB = regB ^ regC;
                break;
            case 5: // out
                output.push(readComboOperand(operand) % 8);
                break;
            case 6: // bdv
                regB = Math.trunc(regA / Math.pow(2, readComboOperand(operand)));
                break;
            case 7: // cdv
                regC = Math.trunc(regA / Math.pow(2, readComboOperand(operand)));
                break;
            default:
                throw new Error("Invalid program opcode: " + opcode);
        }
    };

    // run the program
    while (programPointer < program.length) {
        runInstruction(program[programPointer], program[programPointer+1]);
        if (!jumped) {
            programPointer += 2;
        }
    }

    return output.join(",");
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}