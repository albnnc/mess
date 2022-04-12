import { eventually, nats, scheming } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";
import { preventChildDeps } from "../utils/mod.ts";

export async function handleRoom({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = roomSchema;
  const entity = "ROOM";
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
          entity: "RACK",
          filter: { roomId: data.id },
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
