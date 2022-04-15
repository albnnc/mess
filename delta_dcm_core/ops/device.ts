import { eve, nats, scheming } from "../deps.ts";
import { deviceSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDeviceOps({ nc, db }: OpOptions) {
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
  await eve.handleDeleteOp({
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
  await eve.handleSearchOp({ nc, db, codec, entity });
}
