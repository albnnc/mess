import { assertEquals } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { handleReading } from "./handle_reading.ts";

Deno.test("handle reading", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(Deno.env.get("MONGO_URL") ?? "");
  const db = mongoClient.database("test");
  const collection = db.collection("ENTITY");
  const codec = nats.JSONCodec();
  await handleReading({
    nc,
    db,
    codec,
    entity: "ENTITY",
  });
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
      const msg = await nc.request("ENTITY.TEST.REQUEST.READ");
      const msgData = codec.decode(msg.data) as Record<string, unknown>;
      assertEquals(msgData, { id: "TEST" });
      assertEquals(msg.headers?.get("Status"), "200");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      await prepareTesting();
      const msg = await nc.request("ENTITY.TEST_UNKNOWN.REQUEST.READ");
      assertEquals(msg.headers?.get("Status"), "404");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
