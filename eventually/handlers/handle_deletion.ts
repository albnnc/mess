import { mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface DeletionOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  validate?: (data: scheming.FromSchema<T>) => void;
}

export async function handleDeletion<T extends scheming.Schema>({
  db,
  schema: _,
  validate,
  entity,
  ...rest
}: DeletionOptions<T>) {
  const collection = db.collection(entity);
  await handleMutation({
    entity,
    mutation: "DELETE",
    process: async (id) => {
      const prior = (await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      )) as scheming.FromSchema<T>;
      if (!prior) {
        throw new Error("Unable to delete non-existent entity");
      }
      validate?.(prior);
      await collection.deleteOne({ id });
      return prior;
    },
    ...rest,
  });
}
