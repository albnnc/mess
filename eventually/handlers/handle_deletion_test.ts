import { assertEquals, getStreamMsgs } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { handleDeletion } from "./handle_deletion.ts";

Deno.test("handle deletion", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(Deno.env.get("MONGO_URL") ?? "");
  const db = mongoClient.database("TEST");
  const collection = db.collection("ENTITY");
  const codec = nats.JSONCodec();
  await handleDeletion({ nc, db, codec, entity: "ENTITY" });
  const prepareTesting = async () => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge("ENTITY");
    await collection.drop().catch(() => undefined);
    await collection.insertOne({ id: "TEST" });
  };
  await t.step({
    name: "handle success",
    fn: async () => {
      await prepareTesting();
      await nc.request("ENTITY.TEST.REQUEST.DELETE");
      const msgs = await getStreamMsgs(nc, "ENTITY");
      const msgData = msgs.map((v) =>
        v.data.length > 0
          ? (codec.decode(v.data) as Record<string, unknown>)
          : undefined
      );
      assertEquals(
        msgs.map((v) => v.subject),
        ["ENTITY.TEST.EVENT.DELETE.ATTEMPT", "ENTITY.TEST.EVENT.DELETE.SUCCESS"]
      );
      assertEquals(msgData[0], undefined);
      assertEquals(msgData[1], { id: "TEST" });
      const dbData = await collection.findOne(
        { id: "TEST" },
        { projection: { _id: 0 } }
      );
      assertEquals(dbData, undefined);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      await prepareTesting();
      await nc.request("ENTITY.NON_EXISTENT.REQUEST.DELETE");
      const msgs = await getStreamMsgs(nc, "ENTITY");
      assertEquals(
        msgs.map((v) => v.subject),
        [
          "ENTITY.NON_EXISTENT.EVENT.DELETE.ATTEMPT",
          "ENTITY.NON_EXISTENT.EVENT.DELETE.ERROR",
        ]
      );
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
