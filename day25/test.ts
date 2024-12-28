import { assertEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";

Deno.test("part1", () => {
    assertEquals(part1(), 2824);
});
