import { mongo, scheming } from "../deps.ts";
import { ConflictError } from "../errors/mod.ts";
import { handleMutateOp, MutateOpOptions } from "./mutate.ts";

export interface InsertOpOptions<T extends scheming.Schema>
  extends Omit<MutateOpOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleInsertOp<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: InsertOpOptions<T>) {
  const collection = db.collection(entity);
  await handleMutateOp({
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
