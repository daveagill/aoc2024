/* This is what the answer looked like when rendered:
.....................................................................................................
............*........................................................................................
............................................................................................*........
......*.........................................................*....................................
................*....................................................................................
.........................*........................................................*..................
.............................*.......................................................................
...........................................................*.........................................
*....................................................................................................
...................................*.........................................................*.......
...................................................*.................................................
.............................................................................................*.......
......................*.................................*............................................
..*......................................................................................*...........
.....................................................................................................
.......*.........................*...................................................................
.....................................................................................................
......................................*******************************................................
...........*..........................*.............................*................................
......................................*.............................*................................
......................................*.............................*..*....*........................
........*.............................*.............................*...........................*....
......................................*..............*..............*....................*...........
.......................*..............*.............***.............*................................
......................................*............*****............*........*.......................
......................................*...........*******...........*................................
.....*................................*..........*********..........*................................
......................................*............*****............*......*.........................
......................................*...........*******...........*................................
*.....................................*..........*********..........*................................
......................................*.........***********.........*....*...........................
......*...........*...................*........*************........*...................*..*.........
......................................*..........*********..........*................................
.*....................................*.........***********.........*.....*.*...................*....
......................................*........*************........*................................
........*...........*.................*.......***************.......*...............*................
.......*.......*......................*......*****************......*................................
............................*.........*........*************........*......................*....*....
..............*.......................*.......***************.......*................................
........................*.............*......*****************......*....................*...........
*.*...................................*.....*******************.....*...*............................
......................................*....*********************....*...........*....................
..............................*.......*.............***.............*.*..............................
......................................*.............***.............*................................
......................................*.............***.............*.................*..............
..................*.......*....*......*.............................*................................
......................................*.............................*................................
......................................*.............................*.........*.....*................
......................................*.............................*................................
......................................*******************************................................
.......*...................................................................................*.........
...........................................................*.........................................
...*................................................................*................................
................................................................................*....................
.....................................................................................................
...*.................................................................................................
...........................*.........................................................................
.......................................................................*.............................
..............*.........*......................................*..................*..................
.....................................................................................*..*.......*....
....................*................................................................................
.....................................................................................................
................................................................................................*....
...........*.........................................................................................
.......................*............................*.*..............................................
.....................................................................................................
..................................................*.*..........................*.....................
...............*......................................................*..............................
*...................................................................................*................
...................................................*......................................*..........
...............................................*.....................................................
.................................................................*...................................
.........*......................*.*...............*.................................*................
.....................................................................................................
.*...................................................................................................
...........................................*.........*...............................................
..............*...........................*........................................................*.
.....................................................................................................
........................................*.................*..........................................
.....................................................................................................
................................................................*....................................
............................................*.................*.............*.....*..........*.......
.....................................................*...............................................
..................*......................*.......*....................*..............................
...............................................................*..............*.........*............
.......*....................................................................................*........
...............*......................................................................*..............
.................................................................*...................................
................................................*....................................................
.....................................................................................................
......*............................................*.................................................
...............................................................*......*..............................
.....................................................................................................
.....................................................................................................
.....................................................................................................
.............*........*..............................................................................
................................................................................................*....
.....................................................................................................
...*...................*.......................*..............................................*......
.......................................................................*.............................
...........................................................*.........................................
.......*.................*.....................................................*......*..............
.........................................................*...........................................
*/

import { readLines } from "../helpers.ts";

type Robot = {
    x: number,
    y: number,
    vx: number,
    vy: number
}

export function part2() {
    const lines = readLines("day14/data.txt");

    const robots = lines.map(line => {
        const [x, y, vx, vy] = line.match(/-?[0-9]+/g)!.map(Number);
        return {x, y, vx, vy} as Robot;
    });
    
    const width = 101;
    const height = 103;

    const MOST_ROBOTS = robots.length / 2; // what do we consider to be "most robots"? (50% or more)

    let time = 0;
    while (true) {
        ++time;

        const positions = new Set<number>();

        // simulate robots
        for (const r of robots) {
            const projectedX = r.x + r.vx;
            const projectedY = r.y + r.vy;
            r.x = (width + projectedX % width) % width;
            r.y = (height + projectedY % height) % height;

            // hash the position
            positions.add(r.y * height + r.x);
        }

        // check for adjacent robots in cardinal directions using the positions hash
        let numCloseRobots = 0;
        let remaining = robots.length;
        for (const r of robots) {
            --remaining;
            if (remaining + numCloseRobots < MOST_ROBOTS) { break; } // no point continuing when impossible to reach goal

            if (positions.has((r.y-1) * height + r.x) ||
                positions.has((r.y+1) * height + r.x) ||
                positions.has(r.y * height + r.x+1) ||
                positions.has(r.y * height + r.x-1)) {
                ++numCloseRobots;
            }
        }

        // is it most robots?
        if (numCloseRobots > MOST_ROBOTS) {
            return time;
        }
    }
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}