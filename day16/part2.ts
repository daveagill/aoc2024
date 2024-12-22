import { readLines } from "../helpers.ts";

type Facing = 'n' | 's' | 'e' | 'w';
type Node = {
    cellIdx: number,
    facing: Facing,
    score: number,
    via: Node[]
}
function nodeID(n:Node) {
    return nodeIDFromParts(n.facing, n.cellIdx);
}
function nodeIDFromParts(facing:Facing, cellIdx:number) {
    return facing + '.' + cellIdx;
}

export function part2() {
    const lines = readLines("day16/data.txt");

    // define our grid
    const grid = lines.join('').split('');
    const width = lines[0].length;
    const height = lines.length;
    const getOffset = (idx:number, xOffset:number, yOffset:number) => {
        const [x, y] = [idx % width + xOffset, Math.floor(idx / width) + yOffset];
        if (x < 0 || y < 0 || x >= width || y >= height) { return [-1, ''] as const; }
        const offsetIdx = x + y*width;
        return [offsetIdx, grid[offsetIdx]] as const;
    }

    const startIdx = grid.indexOf('S');
    const endIdx = grid.indexOf('E');

    const nodeMap = new Map<string, Node>();
    const queue = [] as Node[];

    // seed the startIdx
    queue.push({cellIdx:startIdx, facing:'e', score:0, via:[]});
    nodeMap.set(nodeID(queue[0]), queue[0]);

    // tracks best score to end
    let bestScore = Number.POSITIVE_INFINITY;

    while (queue.length > 0) {
        // pop from the priority queue
        queue.sort((a, b) => a.score - b.score);
        const currentNode = queue.shift()!;

        // don't proceed past endidx
        if (currentNode.cellIdx === endIdx) {
            bestScore = Math.min(bestScore, currentNode.score);
            continue;
        }

        // determine available next steps
        let nextFacings: Facing[];
        if (currentNode.facing === 'n' || currentNode.facing === 's') { nextFacings = [currentNode.facing, 'e', 'w']; }
        else { nextFacings = [currentNode.facing, 'n', 's']; }

        nextFacings.forEach(facing => {
            let offset: [number, number];
            if (facing === 'n') { offset = [0, 1]; } 
            if (facing === 's') { offset = [0, -1]; } 
            if (facing === 'e') { offset = [1, 0]; } 
            if (facing === 'w') { offset = [-1, 0]; }

            const [gridIdx, value] = getOffset(currentNode.cellIdx, offset![0], offset![1]);

            // ignore walls
            if (value === '#') { return; }

            // get or initialise neighbour node
            const neighbourNodeID = nodeIDFromParts(facing, gridIdx);
            let neighbourNode = nodeMap.get(neighbourNodeID);
            if (!neighbourNode) {
                neighbourNode = {cellIdx:gridIdx, facing, score:Number.POSITIVE_INFINITY, via:[]};
                nodeMap.set(neighbourNodeID, neighbourNode);
                queue.push(neighbourNode);
            }

            // update visitation tracking
            neighbourNode.via.push(currentNode);
            
            // calculate score (plus 1000 for a 90 degree turn or 2000 for a 180 degree turn)
            const isSameDirection = facing === currentNode.facing;
            const score = currentNode.score + 1 + (isSameDirection ? 0 : 1000);

            neighbourNode.score = Math.min(score, neighbourNode.score);
        });
    }

    // walk the routing from back to front
    const visited = new Set<number>();
    const walkPaths = (node: Node) => {
        visited.add(node.cellIdx);
        node.via.filter(v => v.score < node.score).forEach(walkPaths);
    };

    // starting from via end points, walk paths backwards and track visited cells
    [nodeMap.get(nodeIDFromParts('n', endIdx)),
     nodeMap.get(nodeIDFromParts('e', endIdx)),
     nodeMap.get(nodeIDFromParts('s', endIdx)),
     nodeMap.get(nodeIDFromParts('w', endIdx))]
        .filter(n => !!n)
        .filter(n => n.score === bestScore)
        .forEach(walkPaths);

    return visited.size;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}