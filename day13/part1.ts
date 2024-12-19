type Vec2 = {
    x: number,
    y: number;
}

type ClawMachine = {
    buttonA: Vec2,
    buttonB: Vec2,
    prize: Vec2
}

export function part1() {
    const text = Deno.readTextFileSync("day13/data.txt");

    const values = text.replaceAll(/[^0-9]+/g, ' ').trim().split(' ').map(Number);
    const machines: ClawMachine[] = [];
    for (let i = 0; i < values.length; i += 6) {
        machines.push({
            buttonA: { x:values[i+0], y:values[i+1] },
            buttonB: { x:values[i+2], y:values[i+3] },
            prize: { x:values[i+4], y:values[i+5] }
        });
    }

    
    const play = (machine: ClawMachine) => {
        let bestScore = Number.POSITIVE_INFINITY;
        for (let buttonAPresses = 0; buttonAPresses < 100; ++buttonAPresses) {
            for (let buttonBPresses = 0; buttonBPresses < 100; ++buttonBPresses) {
                const clawX = machine.buttonA.x * buttonAPresses + machine.buttonB.x * buttonBPresses;
                const clawY = machine.buttonA.y * buttonAPresses + machine.buttonB.y * buttonBPresses;
        
                // overshot the prize? Then this combo is no good
                if (clawX > machine.prize.x || clawY > machine.prize.y) {
                    break;
                }

                // found the prize?
                if (clawX === machine.prize.x && clawY === machine.prize.y) {
                    // return the number of tokens required (3 tokens for buttonA, 1 token for buttonB)
                    const tokensRequired = buttonAPresses * 3 + buttonBPresses;
                    bestScore = Math.min(bestScore, tokensRequired);
                }
            }
        }

        return bestScore;
    };

    return machines
        .map(play)
        .filter(n => n < Number.POSITIVE_INFINITY)
        .reduce((acc, val) => acc+val, 0);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}