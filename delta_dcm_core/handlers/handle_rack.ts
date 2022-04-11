import { eventually, nats, scheming } from "../deps.ts";
import { rackSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleRack({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = rackSchema;
  const entity = "RACK";
  await eventually.handleCreation({ nc, db, codec, entity, schema });
  await eventually.handleReading({ nc, db, codec, entity });
  await eventually.handleUpdating({ nc, db, codec, entity, schema });
  await eventually.handleDeletion({
    nc,
    db,
    codec,
    entity,
    process: async (data) => {
      scheming.validateViaSchema(schema, data);
      const deviceCollection = db.collection("DEVICE");
      const childDevice = await deviceCollection.findOne({
        parentType: "RACK",
        parentId: data.id,
      });
      if (childDevice) {
        throw new eventually.ConflictError("Child device exists");
      }
    },
  });
  await eventually.handleSearching({ nc, db, codec, entity });
}
