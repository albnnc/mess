import { eve, nats } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDatacenter({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = datacenterSchema;
  const entity = "DATACENTER";
  await eve.handleCreating({ nc, db, codec, entity, schema });
  await eve.handleReading({ nc, db, codec, entity });
  await eve.handleUpdating({ nc, db, codec, entity, schema });
  await eve.handleDeleting({
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
  await eve.handleSearching({ nc, db, codec, entity });
}
