import * as testing from "../../testing/mod.ts";
import { createPatch } from "./create_patch.ts";

Deno.test("adapt schema", () => {
  const before = {
    a: "A",
    b: "B",
    c: {
      d: [1, 2, 3],
      e: "E",
    },
  };
  const after = {
    a: "A",
    b: "BB",
    c: {
      d: [1, 2, 3, 4],
    },
  };
  testing.assertEquals(createPatch(before, before), {});
  testing.assertEquals(createPatch(before, after), {
    b: "BB",
    c: {
      d: [1, 2, 3, 4],
      e: null,
    },
  });
});
