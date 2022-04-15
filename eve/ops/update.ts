import { collections, mongo, scheming } from "../deps.ts";
import { handleMutateOp, MutateOpOptions } from "./mutate.ts";

export interface UpdateOpOptions<T extends scheming.Schema>
  extends Omit<MutateOpOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleUpdateOp<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: UpdateOpOptions<T>) {
  const collection = db.collection(entity);
  await handleMutateOp({
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
      const [priorExceptReadOnly, priorReadOnly] = scheming.excludeViaSchema(
        schema,
        prior,
        {
          readOnly: true,
        }
      );
      // TODO: Use better way to omit null values.
      const nextExceptReadOnly = JSON.parse(
        JSON.stringify(
          collections.deepMerge(
            priorExceptReadOnly,
            data as Record<PropertyKey, unknown>,
            { arrays: "replace" }
          )
        ),
        (_, v) => (v === null ? undefined : v)
      );
      scheming.validateViaSchema(schema, nextExceptReadOnly, { mode: "w" });
      await process?.(id, nextExceptReadOnly);
      const next = collections.deepMerge(priorReadOnly, nextExceptReadOnly, {
        arrays: "replace",
      });
      await collection.replaceOne({ id }, next);
      return next;
    },
    ...rest,
  });
}
