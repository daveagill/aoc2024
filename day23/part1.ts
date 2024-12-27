import { readLines } from "../helpers.ts";


export function part1() {
    const lines = readLines("day23/data.txt");

    const graph = new Map<string, Set<string>>();
    for (const line of lines) {
        const [vertexA, vertexB] = line.split("-");

        if (!graph.has(vertexA)) {
            graph.set(vertexA, new Set([vertexB]));
        } else {
            graph.get(vertexA)?.add(vertexB);
        }

        if (!graph.has(vertexB)) {
            graph.set(vertexB, new Set([vertexA]));
        } else {
            graph.get(vertexB)?.add(vertexA);
        }
    }

    const found = new Set<string>();
    for (const [v1, neighbours] of graph.entries()) {
        if (!v1.startsWith("t")) { continue; }
        for (const v2 of neighbours) {
            for (const v3 of graph.get(v2)!) {
                if (neighbours.has(v3)) {
                    const triplet = [v1, v2, v3].sort().join(",")
                    found.add(triplet);
                }
            }
        }
    }

    return found.size;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part1());
    console.timeEnd("Time taken");
}