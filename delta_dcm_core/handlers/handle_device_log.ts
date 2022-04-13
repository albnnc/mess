import { eventually, nats } from "../deps.ts";
import { deviceLogSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDeviceLog({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = deviceLogSchema;
  const entity = "DEVICE_LOG";
  await eventually.handleCreation({ nc, db, codec, entity, schema });
  await eventually.handleReading({ nc, db, codec, entity });
  await eventually.handleUpdating({ nc, db, codec, entity, schema });
  await eventually.handleDeletion({ nc, db, codec, entity });
  await eventually.handleSearching({ nc, db, codec, entity });
}
