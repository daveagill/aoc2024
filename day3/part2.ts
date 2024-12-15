
export function part2() {
    const input = Deno.readTextFileSync("day3/data.txt");

    const program = input.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g) ?? [];

    let total = 0;
    let enabledFlag = true;
    for (const command of program) {
        if (command === "do()") {
            enabledFlag = true;
        } else if (command === "don't()") {
            enabledFlag = false;
        } else { // must be a mul()
            if (enabledFlag) {
                const [lhs, rhs] = command.replace("mul(", "").replace(")", "").split(',').map(Number);
                total += lhs * rhs;
            }
        }
    }

    return total;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}