import { assertEquals } from "../testing/mod.ts";
import { mongoizeFiql } from "./mongoize_fiql.ts";

Deno.test("fiql to mongo conversion", async (t) => {
  await t.step("comparsion handling", () => {
    assertEquals(mongoizeFiql("x==0"), { x: "0" });
    assertEquals(mongoizeFiql("x=op=0"), { x: { $op: "0" } });
  });
  await t.step("logic handling", () => {
    assertEquals(mongoizeFiql("x==0,y==0"), { $or: [{ x: "0" }, { y: "0" }] });
    assertEquals(mongoizeFiql("x==0;y==0"), { $and: [{ x: "0" }, { y: "0" }] });
    assertEquals(mongoizeFiql("(x==0,y==0);z==0"), {
      $and: [{ $or: [{ x: "0" }, { y: "0" }] }, { z: "0" }],
    });
  });
});
