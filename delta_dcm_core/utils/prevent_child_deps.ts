import { eventually, mongo } from "../deps.ts";

export interface ChildDepsOptions {
  db: mongo.Database;
  entity: string;
  filter: mongo.Filter<Record<string, unknown>>;
}

export async function preventChildDeps({
  db,
  entity,
  filter,
}: ChildDepsOptions) {
  const roomCollection = db.collection(entity);
  const child = await roomCollection.findOne(filter);
  if (child) {
    throw new eventually.ConflictError(`Child ${entity} exists`);
  }
}
