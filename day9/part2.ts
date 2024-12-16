
export function part2() {
    const diskMap = Deno.readTextFileSync("day9/data.txt");

    // span records blocks allocated to fileIDs as well as subsequent freespace
    type Span = { fileID:number, allocated:number, freespace:number};

    // convert to a span sequence
    const spans = (function() {
        const spans = [] as Span[];
        let isFileBlock = true;
        let fileID = 0;
        for (const blocksLength of diskMap) {
            if (isFileBlock) {
                spans.push({fileID:fileID++, allocated:Number(blocksLength), freespace:0});
            } else {
                spans.at(-1)!.freespace = Number(blocksLength);
            }
            isFileBlock = !isFileBlock;
        }
        return spans;
    })();

    // iterates from back to front and looking for a compaction opportunity
    function scanForCompaction(src:number) {
        // look from left to right (up until our current position) for a suitable new home
        for (let dest = 0; dest < src; ++dest) {
            if (spans[dest].freespace >= spans[src].allocated) { // found one!
                return dest;
            }
        }
        return null;
    }

    // scan backwards evaluating each span once for possible compaction
    for (let src = spans.length-1; src >= 0; --src) {
        const dest = scanForCompaction(src);
        if (dest == null) {
            continue;
        }

        // perform compaction
        spans[src-1].freespace += spans[src].allocated + spans[src].freespace;
        spans[src].freespace = spans[dest].freespace - spans[src].allocated;
        spans[dest].freespace = 0;
        spans.splice(dest+1, 0, ...spans.splice(src, 1));

        // offset iteration because compaction moved the element earlier in the list
        ++src;
    }

    console.log(spans);

    // compute the compacted checksum
    let checksum = 0;
    let index = 0;
    for (const span of spans) {
        for (let i = 0; i < span.allocated; ++i) {
            checksum += span.fileID * index;
            ++index; 
        }
        index += span.freespace;
    }
    return checksum;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", part2());
    console.timeEnd("Time taken");
}