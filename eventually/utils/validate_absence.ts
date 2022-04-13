import { mongo } from "../deps.ts";
import { ConflictError } from "../errors/mod.ts";

export interface ValidateAbsenceOptions {
  db: mongo.Database;
  entity: string;
  filter: mongo.Filter<Record<string, unknown>>;
}

export async function validateAbsence({
  db,
  entity,
  filter,
}: ValidateAbsenceOptions) {
  const collection = db.collection(entity);
  const item = await collection.findOne(filter);
  if (item) {
    throw new ConflictError(`Absence of ${entity} not satisfied`);
  }
}
