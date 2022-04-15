import { eve, nats } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleRoomOps({ nc, db }: OpOptions) {
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
  await eve.handleCreateOp({
    nc,
    db,
    codec,
    entity,
    schema,
    process: validateParent,
  });
  await eve.handleReadOp({ nc, db, codec, entity });
  await eve.handleUpdateOp({
    nc,
    db,
    codec,
    entity,
    schema,
    process: validateParent,
  });
  await eve.handleDeleteOp({
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
  await eve.handleSearchOp({ nc, db, codec, entity });
}
