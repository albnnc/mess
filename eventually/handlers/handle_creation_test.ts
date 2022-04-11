import { assertEquals, assertMatch, getStreamMsgs } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { handleCreation } from "./handle_creation.ts";

Deno.test("handle creation", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(Deno.env.get("MONGO_URL") ?? "");
  const db = mongoClient.database("TEST");
  const collection = db.collection("ENTITY");
  const codec = nats.JSONCodec();
  await handleCreation({
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
    if (await db.listCollectionNames().then((v) => v.includes("ENTITY"))) {
      await collection.drop();
    }
  };
  await t.step({
    name: "handle success",
    fn: async () => {
      await prepareTesting();
      const inputData = { username: "X", password: "Y" };
      await nc.request("ENTITY.REQUEST.CREATE", codec.encode(inputData));
      const msgs = await getStreamMsgs(nc, "ENTITY");
      const msgSubjects = msgs.map((v) => v.subject);
      const msgData = msgs.map(
        (v) => codec.decode(v.data) as Record<string, unknown>
      );
      const { id, ...rest } = msgData[1];
      const dbData = await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      );
      assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.CREATE\.ATTEMPT$/);
      assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.CREATE\.SUCCESS$/);
      assertEquals(msgData[0], inputData);
      assertEquals(typeof id, "string");
      assertEquals(rest, inputData);
      assertEquals(msgData[1], dbData);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      await prepareTesting();
      await nc.request("ENTITY.REQUEST.CREATE", codec.encode(""));
      const msgs = await getStreamMsgs(nc, "ENTITY");
      const msgSubjects = msgs.map((v) => v.subject);
      const count = await collection.countDocuments();
      assertMatch(msgSubjects[0], /^ENTITY\..+\.EVENT\.CREATE\.ATTEMPT$/);
      assertMatch(msgSubjects[1], /^ENTITY\..+\.EVENT\.CREATE\.ERROR$/);
      assertEquals(count, 0);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
