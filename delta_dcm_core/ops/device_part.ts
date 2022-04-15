import { eve, nats } from "../deps.ts";
import { devicePartSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDevicePartOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: devicePartSchema,
    entity: "DEVICE_PART",
  };
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DEVICE",
      filter: { id: data.deviceId },
    });
  };
  await eve.handleCreateOp({ ...common, process: validateParent });
  await eve.handleInsertOp({ ...common, process: validateParent });
  await eve.handleReadOp(common);
  await eve.handleUpdateOp({ ...common, process: validateParent });
  await eve.handleDeleteOp(common);
  await eve.handleSearchOp(common);
}
