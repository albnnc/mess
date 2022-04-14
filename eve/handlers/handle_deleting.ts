import { mongo } from "../deps.ts";
import { handleMutating, MutatingOptions } from "./handle_mutating.ts";

export interface DeletingOptions
  extends Omit<MutatingOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  process?: (id: string, data: unknown) => void | Promise<void>;
}

export async function handleDeleting({
  db,
  process,
  entity,
  ...rest
}: DeletingOptions) {
  const collection = db.collection(entity);
  await handleMutating({
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
      await process?.(id, prior);
      await collection.deleteOne({ id });
      return prior;
    },
    ...rest,
  });
}
