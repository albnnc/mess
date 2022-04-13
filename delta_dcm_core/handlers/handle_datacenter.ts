import { eventually, nats } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDatacenter({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = datacenterSchema;
  const entity = "DATACENTER";
  await eventually.handleCreation({ nc, db, codec, entity, schema });
  await eventually.handleReading({ nc, db, codec, entity });
  await eventually.handleUpdating({ nc, db, codec, entity, schema });
  await eventually.handleDeletion({
    nc,
    db,
    codec,
    entity,
    process: async (id) => {
      await Promise.all([
        eventually.validateAbsence({
          db,
          entity: "ROOM",
          filter: { datacenterId: id },
        }),
        eventually.validateAbsence({
          db,
          entity: "DEVICE",
          filter: { parentType: entity, parentId: id },
        }),
      ]);
    },
  });
  await eventually.handleSearching({ nc, db, codec, entity });
}
