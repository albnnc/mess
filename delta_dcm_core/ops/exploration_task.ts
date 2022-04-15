import { eve, nats } from "../deps.ts";
import { explorationTaskSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleExplorationTaskOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: explorationTaskSchema,
    entity: "EXPLORATION_TASK",
  };
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "ADAPTER",
      filter: { id: data.adapterId },
    });
  };
  await eve.handleCreateOp({ ...common, process: validateParent });
  await eve.handleInsertOp({ ...common, process: validateParent });
  await eve.handleUpdateOp({ ...common, process: validateParent });
  await eve.handleNoticeOp(common);
  await eve.handleReadOp(common);
  await eve.handleSearchOp(common);
  await eve.handleDeleteOp(common);
}
