import * as testing from "../../testing/mod.ts";
import { handleReadOp } from "./read.ts";

Deno.test("generic reading", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleReadOp({ nc, db, codec, entity: "ENTITY" });
  const collection = db.collection("ENTITY");
  await collection.insertOne({ id: "x" });
  const msgX = await nc.request("ENTITY.x.REQUEST.READ");
  const msgY = await nc.request("ENTITY.y.REQUEST.READ");
  testing.assertEquals(codec.decode(msgX.data), { id: "x" });
  testing.assertEquals(msgX.headers?.get("Status-Code"), "200");
  testing.assertEquals(msgY.headers?.get("Status-Code"), "404");
  await dispose();
});
