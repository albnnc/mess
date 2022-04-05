import { assertEquals, getStreamMsgs } from "../../testing/mod.ts";
import { mongo, nats } from "../deps.ts";
import { CreationOptions, handleCreation } from "./handle_creation.ts";

Deno.test("handle creation", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("NATS_URL") });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect("mongodb://root:root@localhost:27017");
  const db = mongoClient.database("test");
  const options: CreationOptions<Record<string, unknown>> = {
    nc,
    db,
    collectionName: "tests",
    codec: nats.JSONCodec(),
    streamName: "TEST",
    subjectPrefix: "TEST.",
    schema: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string", writeOnly: true },
      },
      required: ["username", "password"],
    },
  };
  await handleCreation(options);
  const prepareTesting = async () => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge(options.streamName);
    if (
      await db
        .listCollectionNames()
        .then((v) => v.includes(options.collectionName))
    ) {
      await db.collection(options.collectionName).drop();
    }
  };
  await t.step({
    name: "handle success",
    fn: async () => {
      await prepareTesting();
      const input = { username: "X", password: "Y" };
      await nc.request(
        "TEST.REQUEST.CREATE.DEFAULT",
        options.codec.encode(input)
      );
      const msgs = await getStreamMsgs(nc, options.streamName);
      assertEquals(
        msgs.map((v) => v.subject),
        ["TEST.EVENT.CREATE.ATTEMPT", "TEST.EVENT.CREATE.SUCCESS"]
      );
      const msgData = msgs.map(
        (v) => options.codec.decode(v.data) as Record<string, unknown>
      );
      const { id, ...rest } = msgData[1];
      assertEquals(msgData.length, 2);
      assertEquals(msgData[0], input);
      assertEquals(typeof id, "string");
      assertEquals(rest, input);
      const collection = db.collection(options.collectionName);
      const dbData = await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      );
      assertEquals(msgData[1], dbData);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle failure",
    fn: async () => {
      await prepareTesting();
      await nc.request("TEST.REQUEST.CREATE.DEFAULT", options.codec.encode(""));
      const msgs = await getStreamMsgs(nc, options.streamName);
      assertEquals(
        msgs.map((v) => v.subject),
        ["TEST.EVENT.CREATE.ATTEMPT", "TEST.EVENT.CREATE.FAILED"]
      );
      const collection = db.collection(options.collectionName);
      const count = await collection.countDocuments();
      assertEquals(count, 0);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
  await mongoClient.close();
});
