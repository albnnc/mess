import * as testing from "../../testing/mod.ts";
import { handleInsertOp } from "./insert.ts";

const schema = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
} as const;

Deno.test("generic inserte op success", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  const collection = db.collection("ENTITY");
  await handleInsertOp({ nc, db, codec, entity: "ENTITY", schema });
  const inputData = { username: "x", password: "y" };
  await nc.request("ENTITY.x.REQUEST.INSERT", codec.encode(inputData));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgSubjects = msgs.map((v) => v.subject);
  const msgData = msgs.map(
    (v) => codec.decode(v.data) as Record<string, unknown>
  );
  const { id, ...rest } = msgData[1];
  const dbData = await collection.findOne({ id }, { projection: { _id: 0 } });
  testing.assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.INSERT\.ATTEMPT$/);
  testing.assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.INSERT\.SUCCESS$/);
  testing.assertEquals(msgData[0], inputData);
  testing.assertEquals(id, "x");
  testing.assertEquals(rest, inputData);
  testing.assertEquals(msgData[1], dbData);
  await dispose();
});

Deno.test("generic inserte op error", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleInsertOp({ nc, db, codec, entity: "ENTITY", schema });
  const collection = db.collection("ENTITY");
  await collection.insertOne({ id: "x" });
  const inputData = { username: "x", password: "y" };
  await nc.request("ENTITY.x.REQUEST.INSERT", codec.encode(inputData));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgSubjects = msgs.map((v) => v.subject);
  const count = await collection.countDocuments();
  testing.assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.INSERT\.ATTEMPT$/);
  testing.assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.INSERT\.ERROR$/);
  testing.assertEquals(count, 1);
  await dispose();
});
