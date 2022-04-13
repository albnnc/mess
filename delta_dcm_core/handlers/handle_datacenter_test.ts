import * as eve from "../../eve/mod.ts";
import * as testing from "../../testing/mod.ts";
import { handleDatacenter } from "./mod.ts";

Deno.test("handle datacenter", async (t) => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleDatacenter({ nc, db });
  const msg = await nc.request(
    "DATACENTER.REQUEST.CREATE",
    codec.encode({ name: "Test DC" })
  );
  eve.validateResponse(msg);
  const datacenter = codec.decode(msg.data) as Record<string, unknown>;
  await t.step({
    name: "prevent deletion in case of child rooms",
    fn: async () => {
      const roomCollection = db.collection("ROOM");
      await roomCollection.insertOne({
        datacenterId: datacenter.id,
        name: "Test Room",
      });
      await testing.assertRejects(async () => {
        const msg = await nc.request(
          `DATACENTER.${datacenter.id}.REQUEST.DELETE`
        );
        eve.validateResponse(msg);
      });
      await roomCollection.drop();
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "prevent deletion in case of child devices",
    fn: async () => {
      const deviceCollection = db.collection("DEVICE");
      await deviceCollection.insertOne({
        parentType: "DATACENTER",
        parentId: datacenter.id,
        name: "Test Device",
      });
      await testing.assertRejects(async () => {
        const msg = await nc.request(
          `DATACENTER.${datacenter.id}.REQUEST.DELETE`
        );
        eve.validateResponse(msg);
      });
      await deviceCollection.drop();
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
