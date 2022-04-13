import { eventually, nats } from "../deps.ts";
import { devicePartSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDevicePart({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = devicePartSchema;
  const entity = "DEVICE_PART";
  await eventually.handleCreation({ nc, db, codec, entity, schema });
  await eventually.handleReading({ nc, db, codec, entity });
  await eventually.handleUpdating({ nc, db, codec, entity, schema });
  await eventually.handleDeletion({ nc, db, codec, entity });
  await eventually.handleSearching({ nc, db, codec, entity });
}
