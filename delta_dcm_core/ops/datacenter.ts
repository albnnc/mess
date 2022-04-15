import { eve, nats } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDatacenterOps({ nc, db }: OpOptions) {
  const codec = nats.JSONCodec();
  const schema = datacenterSchema;
  const entity = "DATACENTER";
  await eve.handleCreateOp({ nc, db, codec, entity, schema });
  await eve.handleReadOp({ nc, db, codec, entity });
  await eve.handleUpdateOp({ nc, db, codec, entity, schema });
  await eve.handleDeleteOp({
    nc,
    db,
    codec,
    entity,
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
          filter: { parentType: entity, parentId: id },
        }),
      ]);
    },
  });
  await eve.handleSearchOp({ nc, db, codec, entity });
}
