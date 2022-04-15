import { mongo } from "../deps.ts";
import { handleMutateOp, MutateOpOptions } from "./mutate.ts";

export interface DeleteOpOptions
  extends Omit<MutateOpOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  process?: (id: string, data: unknown) => void | Promise<void>;
}

export async function handleDeleteOp({
  db,
  process,
  entity,
  ...rest
}: DeleteOpOptions) {
  const collection = db.collection(entity);
  await handleMutateOp({
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
