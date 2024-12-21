
const ROBOT = '@';
const BOX = 'O';
const WALL = '#';
const EMPTY = '.';
type Cell = typeof ROBOT | typeof BOX | typeof WALL | typeof EMPTY;
type Direction = '>' | '<' | '^' | 'v';

export function part1() {
    const input = Deno.readTextFileSync("day15/data.txt");

    // parse the data
    const [gridLines, movesLines] = input.split("\n\n").map(text => text.split("\n"));
    const grid = gridLines.join("").split("") as Cell[];
    const moves = movesLines.join("").split("") as Direction[];

    // grid helpers
    const width = gridLines[0].length;
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

    // moves an item on the grid in the given direction, recursively pushing other items
    const moveItem = (gridIdx:number, direction:Direction) => {
        const [destinationIdx, destinationItem] = getDirectionOffset(gridIdx, direction);

        // check if free to move
        if (destinationItem === WALL) {
            return false;
        }

        // check if pushing another box, if so it needs to move too
        if (destinationItem === BOX) {
            if (!moveItem(destinationIdx, direction)) { // if we can't move it then we can't move either
                return false;
            }
        }

        // update the grid
        grid[destinationIdx] = grid[gridIdx];
        grid[gridIdx] = EMPTY;
        return true;
    }

    // simulate robot
    for (const direction of moves) {
        const robotPos = grid.indexOf(ROBOT);
        moveItem(robotPos, direction);
    }

    // sum of "lanternfish GPS coordinates"
    return grid.map((cell, index) => {
        if (cell !== BOX) { return 0; }
        const [x, y] = indexToXY(index);
        return x + y * 100;
    }).reduce((acc, val) => acc+val, 0);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}