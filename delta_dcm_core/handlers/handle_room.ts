import { eve, nats } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleRoom({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = roomSchema;
  const entity = "ROOM";
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DATACENTER",
      filter: { id: data.datacenterId },
    });
  };
  await eve.handleCreating({
    nc,
    db,
    codec,
    entity,
    schema,
    process: validateParent,
  });
  await eve.handleReading({ nc, db, codec, entity });
  await eve.handleUpdating({
    nc,
    db,
    codec,
    entity,
    schema,
    process: validateParent,
  });
  await eve.handleDeleting({
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
