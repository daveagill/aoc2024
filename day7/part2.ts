import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day7/data.txt");

    function recursivelyTryOperators(target:number, partialAnswer:number, operands:number[]): boolean {
        // base case, did we match our target value?
        if (operands.length === 0) {
            return target === partialAnswer;
        }
        
        // recursive case, try summing and/or multiply and/or concatenation operators
        const [nextOperand, ...remainingOperands] = operands;
        return recursivelyTryOperators(target, partialAnswer + nextOperand, remainingOperands) ||
               recursivelyTryOperators(target, partialAnswer * nextOperand, remainingOperands) ||
               recursivelyTryOperators(target, Number(`${partialAnswer}${nextOperand}`), remainingOperands);
    }
    
    let sumOfTestValues = 0;
    for (const equation of lines) {
        const [testValue, ...operands] = equation.split(/:? /g).map(Number);
        const [firstOperand, ...remainingOperands] = operands;
        if (recursivelyTryOperators(testValue, firstOperand, remainingOperands)) {
            sumOfTestValues += testValue;
        }
    }

    return sumOfTestValues;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}