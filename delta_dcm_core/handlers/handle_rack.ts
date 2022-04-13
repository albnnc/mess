import { eve, nats } from "../deps.ts";
import { rackSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleRack({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = rackSchema;
  const entity = "RACK";
  await eve.handleCreation({
    nc,
    db,
    codec,
    entity,
    schema,
    process: async (_, data) => {
      await eve.validateExistence({
        db,
        entity: "ROOM",
        filter: { id: data.roomId },
      });
    },
  });
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
          entity: "DEVICE",
          filter: { parentType: entity, parentId: id },
        }),
      ]);
    },
  });
  await eve.handleSearching({ nc, db, codec, entity });
}
