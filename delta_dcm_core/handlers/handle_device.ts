import { eventually, nats } from "../deps.ts";
import { deviceSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDevice({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = deviceSchema;
  const entity = "DEVICE";
  await eventually.handleCreation({ nc, db, codec, entity, schema });
  await eventually.handleReading({ nc, db, codec, entity });
  await eventually.handleUpdating({ nc, db, codec, entity, schema });
  await eventually.handleDeletion({
    nc,
    db,
    codec,
    entity,
    process: async (id) => {
      await Promise.all(
        ["DEVICE_PART", "DEVICE_METRIC", "DEVICE_LOG"].map((entity) =>
          eventually.deleteViaFilter({
            nc,
            db,
            entity,
            filter: { deviceId: id },
          })
        )
      );
    },
  });
  await eventually.handleSearching({ nc, db, codec, entity });
}
