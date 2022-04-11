import { eventually, nats, scheming } from "../deps.ts";
import { datacenterSchema } from "../schemas/mod.ts";
import { HandlerOptions } from "../types/mod.ts";

export async function handleDatacenter({ nc, db }: HandlerOptions) {
  const codec = nats.JSONCodec();
  const schema = datacenterSchema;
  const entity = "DATACENTER";
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
      const roomCollection = db.collection("ROOM");
      const childRoom = await roomCollection.findOne({ datacenterId: data.id });
      if (childRoom) {
        throw new eventually.ConflictError(
          "Unable to delete entity, since atleast one child exists"
        );
      }
    },
  });
  await eventually.handleSearching({ nc, db, codec, entity });
}
