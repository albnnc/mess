import * as eve from "../../eve/mod.ts";
import * as testing from "../../testing/mod.ts";
import { handleRoom } from "./handle_room.ts";

Deno.test("room creation", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleRoom({ nc, db });
  await testing.assertRejects(async () => {
    const msg = await nc.request(
      "ROOM.REQUEST.CREATE",
      codec.encode({ datacenterId: "x", name: "Test Room" })
    );
    eve.validateResponse(msg);
  });
  await db.collection("DATACENTER").insertOne({ id: "x" });
  const roomDef = { datacenterId: "x", name: "Test Room" };
  const msg = await nc.request("ROOM.REQUEST.CREATE", codec.encode(roomDef));
  eve.validateResponse(msg);
  const { id: _, ...rest } = codec.decode(msg.data) as Record<string, unknown>;
  testing.assertEquals(rest, roomDef);
  await dispose();
});

Deno.test("room deletion", async () => {
  const { nc, db, dispose } = await testing.createTestEnvironment();
  await db.collection("ROOM").insertOne({ id: "x", name: "Test Room" });
  await handleRoom({ nc, db });
  const rackCollection = db.collection("RACK");
  await rackCollection.insertOne({
    roomId: "x",
    name: "Test Rack",
  });
  await testing.assertRejects(async () => {
    const msg = await nc.request(`ROOM.x.REQUEST.DELETE`);
    eve.validateResponse(msg);
  });
  await rackCollection.drop();
  const deviceCollection = db.collection("DEVICE");
  await deviceCollection.insertOne({
    parentType: "ROOM",
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
