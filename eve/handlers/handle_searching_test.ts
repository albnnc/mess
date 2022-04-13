import * as testing from "../../testing/mod.ts";
import { handleSearching } from "./handle_searching.ts";

Deno.test("generic searching", async (t) => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleSearching({ nc, db, codec, entity: "ENTITY" });
  const collection = db.collection("ENTITY");
  const collectionData = new Array(1000).fill(undefined).map((_, i) => ({
    id: i,
    data: crypto.randomUUID(),
  }));
  const collectionDataCopy = collectionData.map((v) => ({ ...v }));
  await collection.insertMany(collectionDataCopy);
  await t.step({
    name: "offset and limit",
    fn: async () => {
      const msg = await nc.request(
        "ENTITY.REQUEST.SEARCH",
        codec.encode({
          offset: 10,
          limit: 10,
        })
      );
      const msgData = codec.decode(msg.data) as Record<string, unknown>;
      testing.assertEquals(msgData, collectionData.slice(10, 20));
      testing.assertEquals(msg.headers?.get("Status-Code"), "200");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "filter",
    fn: async () => {
      const targetData = collectionData.slice(10, 20);
      const msg = await nc.request(
        "ENTITY.REQUEST.SEARCH",
        codec.encode({
          filter: targetData.map((v) => `data==${v.data}`).join(","),
        })
      );
      const msgData = codec.decode(msg.data) as Record<string, unknown>;
      testing.assertEquals(msgData, targetData);
      testing.assertEquals(msg.headers?.get("Status-Code"), "200");
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
