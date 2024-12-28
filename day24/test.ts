import { assertEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part1", () => {
    assertEquals(part1(), 59619940979346n);
});

Deno.test("part2", () => {
    assertEquals(part2(), "bpt,fkp,krj,mfm,ngr,z06,z11,z31");
});