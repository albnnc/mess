import { collections, mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface UpdatingOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (data: scheming.FromSchema<T>) => void;
}

export async function handleUpdating<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: UpdatingOptions<T>) {
  const collection = db.collection(entity);
  await handleMutation({
    entity,
    mutation: "UPDATE",
    process: async (id, data) => {
      if (!data || typeof data !== "object") {
        throw new Error("Entity update must be an object");
      }
      const prior = await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      );
      if (!prior) {
        throw new Error("Unable to update non-existent entity");
      }
      const priorExceptReadOnly = scheming.excludeViaSchema(schema, prior, {
        readOnly: true,
      });
      const nextExceptReadOnly = collections.deepMerge(
        priorExceptReadOnly,
        data as Record<PropertyKey, unknown>,
        { arrays: "replace" }
      );
      scheming.validateViaSchema(schema, nextExceptReadOnly, { mode: "w" });
      process?.(nextExceptReadOnly);
      const next = collections.deepMerge(
        prior as Record<PropertyKey, unknown>,
        nextExceptReadOnly,
        { arrays: "replace" }
      );
      await collection.replaceOne({ id }, next);
      return next;
    },
    ...rest,
  });
}
