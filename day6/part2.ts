import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day6/data.txt");
    
    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const get = (x:number, y:number) => grid[x + y*width];

    // start by figuring out the initial x,y position of the guard, guard always starts facing upwards
    let direction = '^' as '^'|'>'|'v'|'<';
    const posIdx = grid.indexOf(direction);
    let [x, y] = [posIdx % width, Math.floor(posIdx / width)];
    const [originalX, originalY] = [x, y];

    // tests if our guard is still within the map
    const isOnMap = (x:number, y:number) => x >= 0 && x < width && y >= 0 && y < height;

    // tracks if our guard has is repeating her steps (same position and oriented using a composite key as a string)
    const visited = new Set<string>();
    const recordVisit = () => visited.add(`${x},${y},${direction}`);
    const hasVisited = () => visited.has(`${x},${y},${direction}`);

    // brute force through every cell...
    let numLoopsFound = 0;
    grid.forEach((value, index) => {
        // we're not allowed to drop an obstracle on the guard's starting position
        if (index === posIdx) { return; }

        // no point dropping obstacles on top of obstacles
        if (value === '#') { return; }

        // drop an obstacle
        grid[index] = '#';

        // simulate until we detect a successful loop or the guard leaves the map
        while (true) {

            // determine the guard's next possible position or next clockwise orientation
            let [nextX, nextY] = [x, y];
            let clockwise:typeof direction;
            switch (direction) {
                case '^': --nextY; clockwise = '>'; break;
                case '>': ++nextX; clockwise = 'v'; break;
                case 'v': ++nextY; clockwise = '<'; break;
                case '<': --nextX; clockwise = '^'; break;
            }

            // check if that next cell is free (either off-map or not a hash symbol)
            const hasCollided = isOnMap(nextX, nextY) && get(nextX, nextY) === '#';

            // advance position or change orientation to by turning clockwise to avoid a collision
            if (hasCollided) {
                direction = clockwise;

                // detect if the guard is stuck in a loop
                if (hasVisited()) {
                    ++numLoopsFound;
                    break;
                }
                recordVisit();
            } else {
                [x, y] = [nextX, nextY];

                // detect if the guard left the map
                if (!isOnMap(x, y)) { break; }
            }
        }

        // reset state for the next iteration
        // it would be nicer to work with immutable state snapshots but for efficiency I'm not gonna do that
        grid[index] = value;
        direction = '^';
        [x, y] = [originalX, originalY];
        visited.clear();
    });

    return numLoopsFound;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}