import { assertEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part1", () => {
    assertEquals(part1(), "2,3,4,7,5,7,3,0,7");
});

Deno.test("part2", () => {
    assertEquals(part2(), 190384609508367n);
});