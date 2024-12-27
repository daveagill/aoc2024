import { assertEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part1", () => {
    assertEquals(part1(), 1378);
});

Deno.test("part2", () => {
    assertEquals(part2(), "bs,ey,fq,fy,he,ii,lh,ol,tc,uu,wl,xq,xv");
});