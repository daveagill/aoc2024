import { assertEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part1", () => {
    assertEquals(part1(), 37297);
});

Deno.test("part2", () => {
    assertEquals(part2(), 83197086729371);
});