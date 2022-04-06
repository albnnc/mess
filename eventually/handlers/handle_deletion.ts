import { mongo } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface DeletionOptions
  extends Omit<MutationOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  validate?: (data: unknown) => void;
}

export async function handleDeletion({
  db,
  validate,
  entity,
  ...rest
}: DeletionOptions) {
  const collection = db.collection(entity);
  await handleMutation({
    entity,
    mutation: "DELETE",
    process: async (id) => {
      const prior = await collection.findOne(
        { id },
        { projection: { _id: 0 } }
      );
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