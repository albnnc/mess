import * as testing from "../../testing/mod.ts";
import { handleCreation } from "./handle_creation.ts";

const schema = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string", writeOnly: true },
  },
  required: ["username", "password"],
} as const;

Deno.test("generic creation success", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  const collection = db.collection("ENTITY");
  await handleCreation({ nc, db, codec, entity: "ENTITY", schema });
  const inputData = { username: "x", password: "y" };
  await nc.request("ENTITY.REQUEST.CREATE", codec.encode(inputData));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgSubjects = msgs.map((v) => v.subject);
  const msgData = msgs.map(
    (v) => codec.decode(v.data) as Record<string, unknown>
  );
  const { id, ...rest } = msgData[1];
  const dbData = await collection.findOne({ id }, { projection: { _id: 0 } });
  testing.assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.CREATE\.ATTEMPT$/);
  testing.assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.CREATE\.SUCCESS$/);
  testing.assertEquals(msgData[0], inputData);
  testing.assertEquals(typeof id, "string");
  testing.assertEquals(rest, inputData);
  testing.assertEquals(msgData[1], dbData);
  await dispose();
});

Deno.test("generic creation error", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  const collection = db.collection("ENTITY");
  await handleCreation({ nc, db, codec, entity: "ENTITY", schema });
  await nc.request("ENTITY.REQUEST.CREATE", codec.encode(""));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const msgSubjects = msgs.map((v) => v.subject);
  const count = await collection.countDocuments();
  testing.assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.CREATE\.ATTEMPT$/);
  testing.assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.CREATE\.ERROR$/);
  testing.assertEquals(count, 0);
  await dispose();
});
