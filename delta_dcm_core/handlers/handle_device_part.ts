import { eve, nats } from "../deps.ts";
import { devicePartSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDevicePart({ nc, db }: HandlerOptions) {
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
  await eve.handleCreation({
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
  await eve.handleDeletion({ nc, db, codec, entity });
  await eve.handleSearching({ nc, db, codec, entity });
}
