import * as eve from "../../eve/mod.ts";
import * as testing from "../../testing/mod.ts";
import { handleRoom } from "./mod.ts";

Deno.test("handle room", async (t) => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleRoom({ nc, db });
  await db.collection("DATACENTER").insertOne({ id: "test" });
  const msg = await nc.request(
    "ROOM.REQUEST.CREATE",
    codec.encode({ datacenterId: "test", name: "Test Room" })
  );
  eve.validateResponse(msg);
  const room = codec.decode(msg.data) as Record<string, unknown>;
  await t.step({
    name: "prevent creation in case of non-existent parent",
    fn: async () => {
      await testing.assertRejects(async () => {
        const msg = await nc.request(
          "ROOM.REQUEST.CREATE",
          codec.encode({ datacenterId: "_", name: "Test Room" })
        );
        eve.validateResponse(msg);
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "prevent deletion in case of child rooms",
    fn: async () => {
      const rackCollection = db.collection("RACK");
      await rackCollection.insertOne({
        roomId: room.id,
        name: "Test Rack",
      });
      await testing.assertRejects(async () => {
        const msg = await nc.request(`ROOM.${room.id}.REQUEST.DELETE`);
        eve.validateResponse(msg);
      });
      await rackCollection.drop();
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "prevent deletion in case of child devices",
    fn: async () => {
      const deviceCollection = db.collection("DEVICE");
      await deviceCollection.insertOne({
        parentType: "ROOM",
        parentId: room.id,
        name: "Test Device",
      });
      await testing.assertRejects(async () => {
        const msg = await nc.request(`DATACENTER.${room.id}.REQUEST.DELETE`);
        eve.validateResponse(msg);
      });
      await deviceCollection.drop();
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
