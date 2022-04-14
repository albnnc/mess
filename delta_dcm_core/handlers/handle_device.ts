import { eve, nats, scheming } from "../deps.ts";
import { deviceSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDevice({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = deviceSchema;
  const entity = "DEVICE";
  const validateParent = async (
    _: string,
    data: scheming.FromSchema<typeof schema>
  ) => {
    await eve.validateExistence({
      db,
      entity: data.parentType,
      filter: { id: data.parentId },
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
  await eve.handleDeleting({
    nc,
    db,
    codec,
    entity,
    process: async (id) => {
      await Promise.all(
        ["DEVICE_PART", "DEVICE_METRIC", "DEVICE_LOG"].map((entity) =>
          eve.deleteViaFilter({
            nc,
            db,
            entity,
            filter: { deviceId: id },
          })
        )
      );
    },
  });
  await eve.handleSearching({ nc, db, codec, entity });
}
