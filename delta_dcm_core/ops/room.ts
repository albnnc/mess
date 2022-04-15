import { eve, nats } from "../deps.ts";
import { roomSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleRoomOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: roomSchema,
    entity: "ROOM",
  };
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DATACENTER",
      filter: { id: data.datacenterId },
    });
  };
  await eve.handleCreateOp({ ...common, process: validateParent });
  await eve.handleInsertOp({ ...common, process: validateParent });
  await eve.handleUpdateOp({ ...common, process: validateParent });
  await eve.handleReadOp(common);
  await eve.handleSearchOp(common);
  await eve.handleDeleteOp({
    ...common,
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
          filter: { parentType: common.entity, parentId: id },
        }),
      ]);
    },
  });
}
