import { assertEquals, getStreamMsgs } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { handleUpdate } from "./handle_update.ts";

Deno.test("handle creation", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(Deno.env.get("MONGO_URL") ?? "");
  const db = mongoClient.database("test");
  const collection = db.collection("ENTITY");
  const codec = nats.JSONCodec();
  await handleUpdate({
    nc,
    db,
    codec,
    entity: "ENTITY",
    schema: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string", writeOnly: true },
      },
      required: ["username", "password"],
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
      assertEquals(
        msgs.map((v) => v.subject),
        ["ENTITY.TEST.EVENT.UPDATE.ATTEMPT", "ENTITY.TEST.EVENT.UPDATE.SUCCESS"]
      );
      const msgData = msgs.map(
        (v) => codec.decode(v.data) as Record<string, unknown>
      );
      assertEquals(msgData[0], update);
      assertEquals(msgData[1], { id: "TEST", ...update });
      const dbData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
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
      assertEquals(
        msgs.map((v) => v.subject),
        ["ENTITY.TEST.EVENT.UPDATE.ATTEMPT", "ENTITY.TEST.EVENT.UPDATE.ERROR"]
      );
      const finalData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
      assertEquals(initialData, finalData);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
