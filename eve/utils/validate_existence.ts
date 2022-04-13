import { mongo } from "../deps.ts";
import { ConflictError } from "../errors/mod.ts";

export interface ValidateExistenceOptions {
  db: mongo.Database;
  entity: string;
  filter: mongo.Filter<Record<string, unknown>>;
}

export async function validateExistence({
  db,
  entity,
  filter,
}: ValidateExistenceOptions) {
  const collection = db.collection(entity);
  const item = await collection.findOne(filter);
  if (!item) {
    throw new ConflictError(`Existence of ${entity} not satisfied`);
  }
}
