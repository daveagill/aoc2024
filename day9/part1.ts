
export function part1() {
    const diskMap = Deno.readTextFileSync("day9/data.txt");

    // expand the diskmap to its verbose representation (because it's easier to work with)
    const expandedDiskMap = (function() {
        const blocks = [] as string[];
        let isFileBlock = true;
        let fileID = 0;
        for (const blocksLength of diskMap) {
            const char = isFileBlock ? `${fileID++}` : '.';
            blocks.push(...new Array(Number(blocksLength)).fill(char));
            isFileBlock = !isFileBlock;
        }
        return blocks;
    })();

    // move blocks from the back to the free areas at the front
    let freespaceIndex = 0;
    let backIndex = expandedDiskMap.length;
    while (true) {
        freespaceIndex = expandedDiskMap.indexOf('.', freespaceIndex);
        backIndex--;

        // if pointers have met each other, we are done
        if (freespaceIndex >= backIndex) { break; }

        expandedDiskMap[freespaceIndex] = expandedDiskMap[backIndex];
        expandedDiskMap[backIndex] = '.';
    }

    // compute the compacted checksum
    return expandedDiskMap
                .filter(block => block !== '.')
                .map(Number)
                .reduce((checksum, fileID, index) => checksum + fileID * index, 0);
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}