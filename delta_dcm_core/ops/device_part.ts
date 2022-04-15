import { eve, nats } from "../deps.ts";
import { devicePartSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDevicePartOps({ nc, db }: OpOptions) {
  const codec = nats.JSONCodec();
  const schema = devicePartSchema;
  const entity = "DEVICE_PART";
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DEVICE",
      filter: { id: data.deviceId },
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
  await eve.handleDeleteOp({ nc, db, codec, entity });
  await eve.handleSearchOp({ nc, db, codec, entity });
}
