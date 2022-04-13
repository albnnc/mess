import { mongo, scheming } from "../deps.ts";
import { ConflictError } from "../errors/mod.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface InsertionOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleInsertion<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: InsertionOptions<T>) {
  const collection = db.collection(entity);
  await handleMutation({
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
