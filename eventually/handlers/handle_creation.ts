import { mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  validate?: (data: scheming.FromSchema<T>) => void;
}

export async function handleCreation<T extends scheming.Schema>({
  db,
  schema,
  validate,
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
      validate?.(data);
      const identified = { id, ...data };
      await collection.insertOne({ ...identified });
      return identified;
    },
    ...rest,
  });
}
