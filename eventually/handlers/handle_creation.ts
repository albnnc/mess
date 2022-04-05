import { mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "process"> {
  db: mongo.Database;
  collectionName: string;
  schema: T;
  validate?: (data: scheming.FromSchema<T>) => void;
}

export async function handleCreation<T extends scheming.Schema>({
  db,
  collectionName,
  schema,
  validate,
  ...rest
}: CreationOptions<T>) {
  const collection = db.collection(collectionName);
  await handleMutation({
    process: async (data) => {
      scheming.validateViaSchema(schema, data, { mode: "w" });
      validate?.(data);
      const identified = { id: crypto.randomUUID(), ...data };
      await collection.insertOne({ ...identified });
      return identified;
    },
    ...rest,
  });
}
