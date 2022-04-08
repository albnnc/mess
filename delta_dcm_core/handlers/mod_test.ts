import * as eventually from "../../eventually/mod.ts";
import { assertRejects, createTestEnvironment } from "../../testing/mod.ts";
import { handleDatacenter, handleRoom } from "./mod.ts";

Deno.test("handle mutation", async (t) => {
  const { nc, db, codec, dispose } = await createTestEnvironment();
  await handleDatacenter({ nc, db });
  await handleRoom({ nc, db });

  const createFromDefs = (entity: string, data: unknown[]) =>
    Promise.all(
      data.map(async (v) => {
        const msg = await nc.request(
          `${entity}.REQUEST.CREATE`,
          codec.encode(v)
        );
        eventually.validateResponse(msg);
        return codec.decode(msg.data) as Record<string, unknown>;
      })
    );
  const datacenterDefs = new Array(10)
    .fill(undefined)
    .map((_, i) => ({ name: `Datacenter ${i}` }));
  const datacenters = await createFromDefs("DATACENTER", datacenterDefs);
  const roomDefs = datacenters.map((v, i) => ({
    datacenterId: v.id,
    name: `Room ${i}`,
  }));
  const rooms = await createFromDefs("ROOM", roomDefs);
  // await assertRejects(() =>
  //   nc.request(`DATACENTER.${datacenters[0].id}.REQUEST.DELETE`)
  // );
  await dispose();
});
