import { assertEquals, createTestEnvironment } from "../../testing/mod.ts";
import { handleReading } from "./handle_reading.ts";

Deno.test("handle reading", async (t) => {
  const { nc, db, codec, dispose } = await createTestEnvironment();
  const collection = db.collection("ENTITY");
  await handleReading({
    nc,
    db,
    codec,
    entity: "ENTITY",
  });
  const prepareTesting = async () => {
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
      assertEquals(msg.headers?.get("Status-Code"), "200");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      await prepareTesting();
      const msg = await nc.request("ENTITY.TEST_UNKNOWN.REQUEST.READ");
      assertEquals(msg.headers?.get("Status-Code"), "404");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
