import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day18/data.txt");

    const coords = lines.map(line => line.split(",").map(Number) as [number, number]);

    const width = 71; // 7
    const height = 71; // 7
    const indexToXY = (idx:number) => [idx % width, Math.floor(idx / width)] as const;
    const XYToIndex = (x:number, y:number) => x + y * width;

    const lookForPath = (numBlocksToSimulate:number) => {
        const blocked = new Set<number>(
            coords.slice(0, numBlocksToSimulate).map(([x,y]) => x + width*y)
        );
    
        const startIdx = 0;
        const endIdx = XYToIndex(width-1, height-1);
    
        const queue = [] as number[];
        const distances = new Map<number, number>();
    
        // seed the startIdx
        queue.push(startIdx);
        distances.set(startIdx, 0);
    
        while (queue.length > 0) {
            const currentIdx = queue.shift()!;
            const [x, y] = indexToXY(currentIdx);
            const distance = distances.get(currentIdx)!;
    
            if (currentIdx === endIdx) {
                break;
            }
    
            // BFS crawl the neighbours
            ([[0,1], [0,-1], [1,0], [-1,0]] as [number, number][]).forEach(([offsetX, offsetY]) => {
                const nX = x + offsetX;
                const nY = y + offsetY;
                const neighbourIdx = XYToIndex(nX, nY);
    
                // don't crawl off the map
                if (nX < 0 || nX >= width) { return; }
                if (nY < 0 || nY >= height) { return; }
    
                // avoid corrupted bytes
                if (blocked.has(neighbourIdx)) { return; }
                
                // enqueue newly discovered cells
                if (!distances.has(neighbourIdx)) {
                    queue.push(neighbourIdx);
                    distances.set(neighbourIdx, distance + 1);
                }
            });
        }
    
        return distances.get(endIdx);
    };

    for (let i = 1024; i < lines.length; ++i) {
        if (lookForPath(i) === undefined) {
            return coords[i-1].join(",");
        }
    }
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}