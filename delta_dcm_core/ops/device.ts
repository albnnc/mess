import { eve, nats, scheming } from "../deps.ts";
import { deviceSchema } from "../schemas/mod.ts";
import { OpOptions } from "../types/mod.ts";

export async function handleDeviceOps({ nc, db }: OpOptions) {
  const common = {
    nc,
    db,
    codec: nats.JSONCodec(),
    schema: deviceSchema,
    entity: "DEVICE",
  };
  const validateParent = async (
    _: string,
    data: scheming.FromSchema<typeof common.schema>
  ) => {
    await eve.validateExistence({
      db,
      entity: data.parentType,
      filter: { id: data.parentId },
    });
  };
  await eve.handleCreateOp({ ...common, process: validateParent });
  await eve.handleInsertOp({ ...common, process: validateParent });
  await eve.handleReadOp(common);
  await eve.handleUpdateOp({ ...common, process: validateParent });
  await eve.handleDeleteOp({
    ...common,
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
  await eve.handleSearchOp(common);
}
