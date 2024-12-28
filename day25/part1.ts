import { readLines } from "../helpers.ts";

const SCHEMATIC_WIDTH = 5;
const SCHEMATIC_HEIGHT = 7;
const MAX_PINLENGTH = SCHEMATIC_HEIGHT - 2;

export function part1() {
    const lines = readLines("day25/data.txt");

    // parse lines into key and lock pinlength sequences
    const locks = [] as number[][];
    const keys = [] as number[][];
    for (let i = 0; i < lines.length; i += SCHEMATIC_HEIGHT+1) {
        const schematic = lines.slice(i, i+SCHEMATIC_HEIGHT);

        const isLock = schematic[0][0] === "#";
        const symbol = isLock ? "#" : "."; // reading from the top for locks we read # for keys we read .

        const pins = [] as number[]
        for (let col = 0; col < SCHEMATIC_WIDTH; ++col) {
            let pinLength = 0;
            while (schematic[pinLength + 1][col] === symbol) {
                ++pinLength;
            }
            pins[col] = pinLength;
        }

        if (isLock) {
            locks.push(pins);
        } else {
            // for keys we read the empty space so need invert to determine pin length first
            keys.push(pins.map(p => MAX_PINLENGTH - p))
        }
    }

    // sum the pin lengths and count how many lock.key combos do not exceed the max pin length
    let numThatFit = 0;
    for (const lock of locks) {
        for (const key of keys) {

            // check that all pins are valid
            let valid = true;
            for (let col = 0; col < SCHEMATIC_WIDTH; ++col) {
                if (lock[col] + key[col] > MAX_PINLENGTH) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                ++numThatFit;
            }
        }
    }

    return numThatFit;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}