import { mongo, scheming } from "../deps.ts";
import { ConflictError } from "../errors/mod.ts";
import { handleMutating, MutatingOptions } from "./handle_mutating.ts";

export interface InsertingOptions<T extends scheming.Schema>
  extends Omit<MutatingOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleInserting<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: InsertingOptions<T>) {
  const collection = db.collection(entity);
  await handleMutating({
    entity,
    mutation: "INSERT",
    process: async (id, data) => {
      const prior = await collection.findOne({ id });
      if (prior) {
        throw new ConflictError("Entity with given id already exists");
      }
      scheming.validateViaSchema(schema, data, { mode: "w" });
      await process?.(id, data);
      const identified = { id, ...data };
      await collection.insertOne({ ...identified });
      return identified;
    },
    ...rest,
  });
}
