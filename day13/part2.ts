type Vec2 = {
    x: number,
    y: number;
}

type ClawMachine = {
    buttonA: Vec2,
    buttonB: Vec2,
    prize: Vec2
}

export function part2() {
    const text = Deno.readTextFileSync("day13/data.txt");

    const values = text.replaceAll(/[^0-9]+/g, ' ').trim().split(' ').map(Number);
    const machines: ClawMachine[] = [];
    for (let i = 0; i < values.length; i += 6) {
        machines.push({
            buttonA: { x:values[i+0], y:values[i+1] },
            buttonB: { x:values[i+2], y:values[i+3] },
            prize: { x:values[i+4] + 10000000000000, y:values[i+5] + 10000000000000 }
        });
    }

    const findIntersectionPoint = (directionA: Vec2, directionB: Vec2, prize: Vec2) => {
        // y = mx + c

        // define m for rayA (from origin 0,0)
        const aM = directionA.y / directionA.x;
        const aC = 0;

        // define m and c for rayB (from prize x,y)
        const bM = directionB.y / directionB.x;
        const bC = prize.y - bM * prize.x;

        // find x,y intersection, this assumes the lines are not parallel (which fortunately doesnt occur in the dataset)
        const xIntersect = bC / (aM - bM);
        const yIntersect = aM * xIntersect + aC;

        return [xIntersect, yIntersect] as const;
    }

    const determineScore = ({buttonA, buttonB, prize}: ClawMachine) => {
        // find the intersection point, after that we can treat everything one-dimensionally by considering only the x-axis
        const [xIntersect] = findIntersectionPoint(buttonA, buttonB, prize);

        // determine button press counts (press counts must be integers, can't partially press a button)
        const primaryButtonPresses = Math.round(xIntersect / buttonA.x);
        const secondaryButtonPresses = Math.round((prize.x - xIntersect) / buttonB.x);

        // prize is unwinnable if integerised button presses don't actually reach the prize position
        if (primaryButtonPresses * buttonA.x + secondaryButtonPresses * buttonB.x !== prize.x ||
            primaryButtonPresses * buttonA.y + secondaryButtonPresses * buttonB.y !== prize.y) {
            return Number.POSITIVE_INFINITY;
        }

        // calculate score (buttonA costs 3 tokens, buttonB costs 1 token)
        return primaryButtonPresses * 3 + secondaryButtonPresses * 1;
    }

    return machines
        .map(determineScore)
        .filter(n => n < Number.POSITIVE_INFINITY)
        .reduce((acc, val) => acc+val, 0);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}