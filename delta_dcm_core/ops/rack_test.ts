import * as eve from "../../eve/mod.ts";
import * as testing from "../../testing/mod.ts";
import { handleRackOps } from "./rack.ts";

Deno.test("rack creation", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleRackOps({ nc, db });
  await testing.assertRejects(async () => {
    const msg = await nc.request(
      "RACK.REQUEST.CREATE",
      codec.encode({ roomId: "x", name: "Test Rack" })
    );
    eve.validateResponse(msg);
  });
  await db.collection("ROOM").insertOne({ id: "x" });
  const rackDef = { roomId: "x", name: "Test Rack" };
  const msg = await nc.request("RACK.REQUEST.CREATE", codec.encode(rackDef));
  eve.validateResponse(msg);
  const { id: _, ...rest } = codec.decode(msg.data) as Record<string, unknown>;
  testing.assertEquals(rest, rackDef);
  await dispose();
});

Deno.test("rack deletion", async () => {
  const { nc, db, dispose } = await testing.createTestEnvironment();
  await db.collection("RACK").insertOne({ id: "x", name: "Test Rack" });
  await handleRackOps({ nc, db });
  await db.collection("DEVICE").insertOne({
    parentType: "RACK",
    parentId: "x",
    name: "Test Device",
  });
  await testing.assertRejects(async () => {
    const msg = await nc.request(`DATACENTER.x.REQUEST.DELETE`);
    eve.validateResponse(msg);
  });
  await dispose();
});
