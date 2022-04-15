import { eve, nats } from "../deps.ts";
import { rackSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleRackOps({ nc, db }: OpOptions) {
  const codec = nats.JSONCodec();
  const schema = rackSchema;
  const entity = "RACK";
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "ROOM",
      filter: { id: data.roomId },
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
          entity: "DEVICE",
          filter: { parentType: entity, parentId: id },
        }),
      ]);
    },
  });
  await eve.handleSearchOp({ nc, db, codec, entity });
}
