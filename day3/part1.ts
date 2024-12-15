
export function part1() {
    const input = Deno.readTextFileSync("day3/data.txt");

    const program = input.match(/mul\(\d{1,3},\d{1,3}\)/g) ?? [];

    let total = 0;
    for (const command of program) {
        const [lhs, rhs] = command.replace("mul(", "").replace(")", "").split(',').map(Number);
        total += lhs * rhs;
    }

    return total;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}