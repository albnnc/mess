import { eve, nats } from "../deps.ts";
import { deviceLogSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDeviceLog({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = deviceLogSchema;
  const entity = "DEVICE_LOG";
  const validateParent = async (_: string, data: Record<string, unknown>) => {
    await eve.validateExistence({
      db,
      entity: "DEVICE",
      filter: { id: data.deviceId },
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
  await eve.handleDeleting({ nc, db, codec, entity });
  await eve.handleSearching({ nc, db, codec, entity });
}
