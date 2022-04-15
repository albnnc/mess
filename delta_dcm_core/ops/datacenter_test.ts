import * as eve from "../../eve/mod.ts";
import * as testing from "../../testing/mod.ts";
import { handleDatacenterOps } from "./datacenter.ts";

Deno.test("datacenter deletion", async () => {
  const { nc, db, dispose } = await testing.createTestEnvironment();
  await db.collection("DATACENTER").insertOne({ id: "x", name: "Test DC" });
  await handleDatacenterOps({ nc, db });
  const roomCollection = db.collection("ROOM");
  await roomCollection.insertOne({
    datacenterId: "x",
    name: "Test Room",
  });
  await testing.assertRejects(async () => {
    const msg = await nc.request(`DATACENTER.x.REQUEST.DELETE`);
    eve.validateResponse(msg);
  });
  await roomCollection.drop();
  const deviceCollection = db.collection("DEVICE");
  await deviceCollection.insertOne({
    parentType: "DATACENTER",
    parentId: "x",
    name: "Test Device",
  });
  await testing.assertRejects(async () => {
    const msg = await nc.request(`DATACENTER.x.REQUEST.DELETE`);
    eve.validateResponse(msg);
  });
  await deviceCollection.drop();
  await dispose();
});
