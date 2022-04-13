import { mongo, nats } from "../deps.ts";

export interface DeleteViaFilterOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
  entity: string;
  filter: mongo.Filter<Record<string, unknown>>;
}

export async function deleteViaFilter({
  nc,
  db,
  entity,
  filter,
}: DeleteViaFilterOptions) {
  const collection = db.collection(entity);
  const items = await collection.find(filter).toArray();
  await Promise.all(
    items.map((v) => nc.request(`${entity}.${v.id}.REQUEST.DELETE`))
  );
}
