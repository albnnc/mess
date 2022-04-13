import { eve, nats } from "../deps.ts";
import { deviceLogSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDeviceLog({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = deviceLogSchema;
  const entity = "DEVICE_LOG";
  await eve.handleCreation({ nc, db, codec, entity, schema });
  await eve.handleReading({ nc, db, codec, entity });
  await eve.handleUpdating({ nc, db, codec, entity, schema });
  await eve.handleDeletion({ nc, db, codec, entity });
  await eve.handleSearching({ nc, db, codec, entity });
}
