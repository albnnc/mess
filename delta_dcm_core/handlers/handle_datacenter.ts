import { eventually, nats, scheming } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";
import { preventChildDeps } from "../utils/mod.ts";

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
    process: async (data) => {
      scheming.validateViaSchema(schema, data);
      await Promise.all([
        preventChildDeps({
          db,
          entity: "ROOM",
          filter: { datacenterId: data.id },
        }),
        preventChildDeps({
          db,
          entity: "DEVICE",
          filter: { parentType: entity, parentId: data.id },
        }),
      ]);
    },
  });
  await eventually.handleSearching({ nc, db, codec, entity });
}
