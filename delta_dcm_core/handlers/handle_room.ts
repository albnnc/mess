import { eventually, nats } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

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
    process: async (id) => {
      await Promise.all([
        eventually.validateAbsence({
          db,
          entity: "RACK",
          filter: { roomId: id },
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
