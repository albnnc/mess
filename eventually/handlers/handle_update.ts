import { collections, mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface UpdateOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  validate?: (data: scheming.FromSchema<T>) => void;
}

export async function handleUpdate<T extends scheming.Schema>({
  db,
  schema,
  validate,
  entity,
  ...rest
}: UpdateOptions<T>) {
  const collection = db.collection(entity);
  await handleMutation({
    entity,
    mutation: "UPDATE",
    process: async (id, data) => {
      const prior = await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      );
      if (!prior) {
        throw new Error("Unable to update non-existent entity");
      }
      if (!data || typeof data !== "object") {
        throw new Error("Entity update must be an object");
      }
      const next = collections.deepMerge(
        prior as Record<PropertyKey, unknown>,
        data as Record<PropertyKey, unknown>
      );
      if (prior.id !== next.id) {
        throw new Error("Entity update cannot change `id` property");
      }
      scheming.validateViaSchema(schema, next, { mode: "w" });
      validate?.(next);
      await collection.replaceOne({ id }, next);
      return next;
    },
    ...rest,
  });
}
