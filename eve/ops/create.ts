import { mongo, scheming } from "../deps.ts";
import { handleMutateOp, MutateOpOptions } from "./mutate.ts";

export interface CreateOpOptions<T extends scheming.Schema>
  extends Omit<MutateOpOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleCreateOp<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: CreateOpOptions<T>) {
  const collection = db.collection(entity);
  await handleMutateOp({
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
