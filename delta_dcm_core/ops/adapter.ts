import { eve, nats } from "../deps.ts";
import { adapterSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleAdapterOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: adapterSchema,
    entity: "ADAPTER",
  };
  await eve.handleCreateOp(common);
  await eve.handleInsertOp(common);
  await eve.handleUpdateOp(common);
  await eve.handleNoticeOp(common);
  await eve.handleReadOp(common);
  await eve.handleSearchOp(common);
  await eve.handleDeleteOp({
    ...common,
    process: async () => {
      // TODO: Handle chained exploration tasks and devices.
    },
  });
}
