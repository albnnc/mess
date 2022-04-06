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
      const baseExceptReadOnly = scheming.excludeViaSchema(schema, prior, {
        readOnly: true,
      });
      const nextExceptReadOnly = collections.deepMerge(
        baseExceptReadOnly,
        data as Record<PropertyKey, unknown>
      );
      scheming.validateViaSchema(schema, nextExceptReadOnly, { mode: "w" });
      validate?.(nextExceptReadOnly);
      const next = collections.deepMerge(
        prior as Record<PropertyKey, unknown>,
        nextExceptReadOnly
      );
      await collection.replaceOne({ id }, next);
      return next;
    },
    ...rest,
  });
}
