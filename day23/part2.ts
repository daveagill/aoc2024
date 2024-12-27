import { readLines } from "../helpers.ts";

export function part2() {
    const lines = readLines("day23/data.txt");

    const graph = new Map<string, Set<string>>();
    for (const line of lines) {
        const [vertexA, vertexB] = line.split("-");

        if (!graph.has(vertexA)) {
            graph.set(vertexA, new Set([ vertexB]));
        } else {
            graph.get(vertexA)?.add(vertexB);
        }

        if (!graph.has(vertexB)) {
            graph.set(vertexB, new Set([vertexA]));
        } else {
            graph.get(vertexB)?.add(vertexA);
        }
    }

    const identifyLargestClique = (node:string) => {
        const neighbours = graph.get(node)!;

        let bestClique = new Set<string>();

        for (const n of neighbours) {
            const clique = new Set<string>([node, n]);
            for (const n2 of graph.get(n)!) {
                if (graph.get(n2)!.isSupersetOf(clique)) {
                    clique.add(n2);
                }
            }

            if (clique.size > bestClique.size) {
                bestClique = clique;
            }
        }

        return bestClique;
    }

    let largestSet: Set<string> = new Set<string>();
    for (const computer of graph.keys()) {
        const lanSet = identifyLargestClique(computer);
        if (lanSet.size > largestSet.size) {
            largestSet = lanSet;
        }
    }

    return [...largestSet].sort().join(",");
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}