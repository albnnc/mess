import { assertEquals } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { handleSearching } from "./handle_searching.ts";

Deno.test("handle searching", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(Deno.env.get("MONGO_URL") ?? "");
  const db = mongoClient.database("test");
  const codec = nats.JSONCodec();
  const collection = db.collection("ENTITY");
  const collectionData = new Array(1000).fill(undefined).map((_, i) => ({
    id: i,
    data: Math.random().toString().slice(-4),
  }));
  await handleSearching({
    nc,
    db,
    codec,
    entity: "ENTITY",
  });
  const prepareTesting = async () => {
    await collection.drop().catch(() => undefined);
    const collectionDataCopy = collectionData.map((v) => ({ ...v }));
    await collection.insertMany(collectionDataCopy);
  };
  await t.step({
    name: "handle offset and limit",
    fn: async () => {
      await prepareTesting();
      const msg = await nc.request(
        "ENTITY.REQUEST.SEARCH",
        codec.encode({
          offset: 10,
          limit: 10,
        })
      );
      const msgData = codec.decode(msg.data) as Record<string, unknown>;
      assertEquals(msgData, collectionData.slice(10, 20));
      assertEquals(msg.headers?.get("Status"), "200");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
