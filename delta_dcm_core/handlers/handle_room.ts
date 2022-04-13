import { eve, nats } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleRoom({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = roomSchema;
  const entity = "ROOM";
  await eve.handleCreation({ nc, db, codec, entity, schema });
  await eve.handleReading({ nc, db, codec, entity });
  await eve.handleUpdating({ nc, db, codec, entity, schema });
  await eve.handleDeletion({
    nc,
    db,
    codec,
    entity,
    process: async (id) => {
      await Promise.all([
        eve.validateAbsence({
          db,
          entity: "RACK",
          filter: { roomId: id },
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
