import * as testing from "../../testing/mod.ts";
import { handleUpdateOp } from "./update.ts";

const schema = {
  type: "object",
  properties: {
    id: { type: "string", readOnly: true },
    a: { type: "string" },
    b: { type: "string" },
  },
  required: ["id", "a", "b"],
  additionalProperties: false,
} as const;

Deno.test("generic updating success", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleUpdateOp({ nc, db, codec, entity: "ENTITY", schema });
  const collection = db.collection("ENTITY");
  await collection.insertOne({
    id: "x",
    a: "x",
    b: "x",
  });
  const update = { b: "y" };
  await nc.request("ENTITY.x.REQUEST.UPDATE", codec.encode(update));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgData = msgs.map(
    (v) => codec.decode(v.data) as Record<string, unknown>
  );
  const dbData = await collection.findOne(
    { id: "x" },
    { projection: { _id: 0 } }
  );
  testing.assertEquals(
    msgs.map((v) => v.subject),
    ["ENTITY.x.EVENT.UPDATE.ATTEMPT", "ENTITY.x.EVENT.UPDATE.SUCCESS"]
  );
  testing.assertEquals(msgData[0], { b: "y" });
  testing.assertEquals(msgData[1], { id: "x", a: "x", b: "y" });
  testing.assertEquals(dbData, { id: "x", a: "x", b: "y" });
  await dispose();
});

Deno.test("generic updating error", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleUpdateOp({ nc, db, codec, entity: "ENTITY", schema });
  const collection = db.collection("ENTITY");
  await collection.insertOne({
    id: "x",
    a: "x",
    b: "x",
  });
  const initialData = await collection.findOne(
    { id: "x" },
    { projection: { _id: 0 } }
  );
  await nc.request("ENTITY.x.REQUEST.UPDATE", codec.encode(""));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const finalData = await collection.findOne(
    { id: "x" },
    { projection: { _id: 0 } }
  );
  testing.assertEquals(
    msgs.map((v) => v.subject),
    ["ENTITY.x.EVENT.UPDATE.ATTEMPT", "ENTITY.x.EVENT.UPDATE.ERROR"]
  );
  testing.assertEquals(initialData, finalData);
  await dispose();
});
