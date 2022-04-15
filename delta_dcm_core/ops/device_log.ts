import { eve, nats } from "../deps.ts";
import { deviceLogSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDeviceLogOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: deviceLogSchema,
    entity: "DEVICE_LOG",
  };
  const processParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DEVICE",
      filter: { id: data.deviceId },
    });
  };
  await eve.handleCreateOp({ ...common, process: processParent });
  await eve.handleInsertOp({ ...common, process: processParent });
  await eve.handleUpdateOp({ ...common, process: processParent });
  await eve.handleNoticeOp(common);
  await eve.handleReadOp(common);
  await eve.handleSearchOp(common);
  await eve.handleDeleteOp(common);
}
