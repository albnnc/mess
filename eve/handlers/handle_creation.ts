import { mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleCreation<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: CreationOptions<T>) {
  const collection = db.collection(entity);
  await handleMutation({
    entity,
    mutation: "CREATE",
    pioneer: true,
    process: async (id, data) => {
      scheming.validateViaSchema(schema, data, { mode: "w" });
      await process?.(id, data);
      const identified = { id, ...data };
      await collection.insertOne({ ...identified });
      return identified;
    },
    ...rest,
  });
}