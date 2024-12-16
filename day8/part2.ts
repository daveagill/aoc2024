import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day8/data.txt");

    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const indexToXY = (idx:number) => [idx % width, Math.floor(idx / width)] as const;
    const onGrid = ([x, y]:readonly[number, number]) => x >= 0 && y >= 0 && x < width && y < height;

    // index our antenna positions antennaFrequency->gridIndex
    const antennaIndexes = new Map<string, number[]>();
    for (const [index, cell] of grid.entries()) {
        if (cell === '.') { continue; }

        const gridIndices = antennaIndexes.get(cell) ?? [];
        if (gridIndices.length === 0) {
            antennaIndexes.set(cell, gridIndices);
        }

        gridIndices.push(index);
    }

    // set dedups antinodes landing on the same cell
    const uniqueAntinodes = new Set<string>();

    for (const gridIndices of antennaIndexes.values()) {
        // triangular iteration of the gridIndices looking for antinodes
        for (let i = 0; i < gridIndices.length; ++i) {
            for (let k = i+1; k < gridIndices.length; ++k) {
                const antennaA = indexToXY(gridIndices[i]);
                const antennaB = indexToXY(gridIndices[k]);
                const delta = [antennaA[0] - antennaB[0], antennaA[1] - antennaB[1]] as const;

                // helper function to project antinodes out in a given direction
                const projectAntinodes = (direction:number) => {
                    let step = 0;
                    while (true) {
                        const antinode = [antennaA[0] + delta[0] * step, antennaA[1] + delta[1] * step] as const;
                        // exit loop when we exceed the grid
                        if (!onGrid(antinode)) {
                            break;
                        }
                        // record in the de-dup set
                        uniqueAntinodes.add(antinode.toString());
                        // step in the direction
                        step += direction;
                    }
                };
                
                projectAntinodes(1);
                projectAntinodes(-1);
            }
        }
    }

    return uniqueAntinodes.size;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}