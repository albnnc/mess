import { eve, nats } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDatacenterOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: datacenterSchema,
    entity: "DATACENTER",
  };
  await eve.handleCreateOp(common);
  await eve.handleInsertOp(common);
  await eve.handleReadOp(common);
  await eve.handleUpdateOp(common);
  await eve.handleDeleteOp({
    ...common,
    process: async (id) => {
      await Promise.all([
        eve.validateAbsence({
          db,
          entity: "ROOM",
          filter: { datacenterId: id },
        }),
        eve.validateAbsence({
          db,
          entity: "DEVICE",
          filter: { parentType: common.entity, parentId: id },
        }),
      ]);
    },
  });
  await eve.handleSearchOp(common);
}
