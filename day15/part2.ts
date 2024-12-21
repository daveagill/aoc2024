
const ROBOT = '@';
const BOX = 'O';
const BOXL = '[';
const BOXR = ']';
const WALL = '#';
const EMPTY = '.';
type Cell = typeof ROBOT | typeof BOX | typeof BOXL | typeof BOXR | typeof WALL | typeof EMPTY;
type Direction = '>' | '<' | '^' | 'v';

export function part2() {
    const input = Deno.readTextFileSync("day15/data.txt");

    // parse the data
    const [gridLines, movesLines] = input.split("\n\n").map(text => text.split("\n"));
    const grid = (gridLines.join("").split("") as Cell[]).flatMap(cell => {
        if (cell === BOX) { return [BOXL, BOXR]; }
        if (cell === ROBOT) { return [ROBOT, EMPTY]; }
        return [cell, cell];
    });
    const moves = movesLines.join("").split("") as Direction[];

    // grid helpers
    const width = gridLines[0].length * 2; // double the width for part2
    const height = gridLines.length;
    const indexToXY = (idx:number) => [idx % width, Math.floor(idx / width)] as const;
    const getOffset = (idx:number, xOffset:number, yOffset:number) => {
        const [x, y] = [idx % width + xOffset, Math.floor(idx / width) + yOffset];
        if (x < 0 || y < 0 || x >= width || y >= height) { return [-1, WALL] as const; }
        const offsetIdx = x + y*width;
        return [offsetIdx, grid[offsetIdx]] as const;
    }
    const getDirectionOffset = (gridIdx:number, direction:Direction) => {
        switch (direction) {
            case '>': return getOffset(gridIdx, 1, 0);
            case '<': return getOffset(gridIdx, -1, 0);
            case '^': return getOffset(gridIdx, 0, -1);
            case 'v': return getOffset(gridIdx, 0, 1);
        }
    }

    // checks if an item on the grid in the given direction, recursively pushing other items
    const recursePushes = (gridIdx:number, direction:Direction, doUpdateGrid:boolean) => {
        const [destinationIdx, destinationItem] = getDirectionOffset(gridIdx, direction);

        // check if free to move
        if (destinationItem === WALL) {
            return false;
        }

        // recurse if pushing another box that it too is free to move
        if (destinationItem === BOXL || destinationItem === BOXR) {
            if (!recursePushes(destinationIdx, direction, doUpdateGrid)) { // if we can't move it then we can't move either
                return false;
            }
            // if pushing vertically then we also need to check the adjacent BOXR or BOXL
            const isPushingVertically = direction === "^" || direction === "v";
            const boxNeighbourOffset = destinationItem == BOXL ? 1 : -1;
            if (isPushingVertically && !recursePushes(destinationIdx+boxNeighbourOffset, direction, doUpdateGrid)) {
                return false;
            }
        }

        if (doUpdateGrid) {
            // update the grid
            grid[destinationIdx] = grid[gridIdx];
            grid[gridIdx] = EMPTY;
        }

        return true;
    }

    const canMove = (gridIdx:number, direction:Direction) => recursePushes(gridIdx, direction, false);
    const moveItem = (gridIdx:number, direction:Direction) => recursePushes(gridIdx, direction, true);

    // simulate robot
    for (const direction of moves) {
        const robotPos = grid.indexOf(ROBOT);
        if (canMove(robotPos, direction)) {
            moveItem(robotPos, direction);
        }
    }

    // sum of "lanternfish GPS coordinates"
    return grid.map((cell, index) => {
        if (cell !== BOXL) { return 0; }
        const [x, y] = indexToXY(index);
        return x + y * 100;
    }).reduce((acc, val) => acc+val, 0);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}