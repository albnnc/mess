import {
  assertEquals,
  createTestEnvironment,
  getStreamMsgs,
} from "../../testing/mod.ts";
import { handleUpdating } from "./handle_updating.ts";

Deno.test("handle update", async (t) => {
  const { nc, db, codec, dispose } = await createTestEnvironment();
  const collection = db.collection("ENTITY");
  await handleUpdating({
    nc,
    db,
    codec,
    entity: "ENTITY",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", readOnly: true },
        username: { type: "string" },
        password: { type: "string", writeOnly: true },
      },
      required: ["id", "username", "password"],
      additionalProperties: false,
    },
  });
  const prepareTesting = async () => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge("ENTITY");
    await collection.drop().catch(() => undefined);
    await collection.insertOne({
      id: "TEST",
      username: "TEST",
      password: "TEST",
    });
  };
  await t.step({
    name: "handle success",
    fn: async () => {
      await prepareTesting();
      const update = { username: "X", password: "Y" };
      await nc.request("ENTITY.TEST.REQUEST.UPDATE", codec.encode(update));
      const msgs = await getStreamMsgs(nc, "ENTITY");
      const msgData = msgs.map(
        (v) => codec.decode(v.data) as Record<string, unknown>
      );
      const dbData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
      assertEquals(
        msgs.map((v) => v.subject),
        ["ENTITY.TEST.EVENT.UPDATE.ATTEMPT", "ENTITY.TEST.EVENT.UPDATE.SUCCESS"]
      );
      assertEquals(msgData[0], update);
      assertEquals(msgData[1], { id: "TEST", ...update });
      assertEquals(dbData, { id: "TEST", ...update });
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      await prepareTesting();
      const initialData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
      await nc.request("ENTITY.TEST.REQUEST.UPDATE", codec.encode(""));
      const msgs = await getStreamMsgs(nc, "ENTITY");
      const finalData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
      assertEquals(
        msgs.map((v) => v.subject),
        ["ENTITY.TEST.EVENT.UPDATE.ATTEMPT", "ENTITY.TEST.EVENT.UPDATE.ERROR"]
      );
      assertEquals(initialData, finalData);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
