import { eve, nats } from "../deps.ts";
import { rackSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleRackOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    entity: "RACK",
    schema: rackSchema,
  };
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "ROOM",
      filter: { id: data.roomId },
    });
  };
  await eve.handleCreateOp({ ...common, process: validateParent });
  await eve.handleInsertOp({ ...common, process: validateParent });
  await eve.handleUpdateOp({ ...common, process: validateParent });
  await eve.handleNoticeOp(common);
  await eve.handleReadOp(common);
  await eve.handleSearchOp(common);
  await eve.handleDeleteOp({
    ...common,
    process: async (id) => {
      await Promise.all([
        eve.validateAbsence({
          db,
          entity: "DEVICE",
          filter: { parentType: common.entity, parentId: id },
        }),
      ]);
    },
  });
}
