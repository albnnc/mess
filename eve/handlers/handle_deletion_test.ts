import * as testing from "../../testing/mod.ts";
import { handleDeletion } from "./handle_deletion.ts";

Deno.test("generic deletion success", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleDeletion({ nc, db, codec, entity: "ENTITY" });
  const collection = db.collection("ENTITY");
  await collection.insertOne({ id: "x" });
  await nc.request("ENTITY.x.REQUEST.DELETE");
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgData = msgs.map((v) =>
    v.data.length > 0
      ? (codec.decode(v.data) as Record<string, unknown>)
      : undefined
  );
  const dbData = await collection.findOne(
    { id: "x" },
    { projection: { _id: 0 } }
  );
  testing.assertEquals(
    msgs.map((v) => v.subject),
    ["ENTITY.x.EVENT.DELETE.ATTEMPT", "ENTITY.x.EVENT.DELETE.SUCCESS"]
  );
  testing.assertEquals(msgData[0], undefined);
  testing.assertEquals(msgData[1], { id: "x" });
  testing.assertEquals(dbData, undefined);
  await dispose();
});

Deno.test("generic deletion error", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleDeletion({ nc, db, codec, entity: "ENTITY" });
  const collection = db.collection("ENTITY");
  await collection.insertOne({ id: "x" });
  await nc.request("ENTITY.y.REQUEST.DELETE");
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  testing.assertEquals(
    msgs.map((v) => v.subject),
    ["ENTITY.y.EVENT.DELETE.ATTEMPT", "ENTITY.y.EVENT.DELETE.ERROR"]
  );
  await dispose();
});
