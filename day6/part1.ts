import { readLines } from "../helpers.ts";

export function part1() {
    const lines = readLines("day6/data.txt");
    
    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const set = (x:number, y:number, c:string) => grid[x + y*width] = c;
    const get = (x:number, y:number) => grid[x + y*width];

    // start by figuring out the initial x,y position of the guard, guard always starts facing upwards
    let direction = '^' as '^'|'>'|'v'|'<';
    const posIdx = grid.indexOf(direction);
    let [x, y] = [posIdx % width, Math.floor(posIdx / width)];

    // tests if our guard is still within the map - this is our stopping condition
    const isOnMap = (x:number, y:number) => x >= 0 && x < width && y >= 0 && y < height;

    while (isOnMap(x, y)) {
        // mark the guard's path with an X
        set(x, y, 'X');

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
        } else {
            [x, y] = [nextX, nextY];
        }
    }

    return grid.filter(cell => cell === 'X').length;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}