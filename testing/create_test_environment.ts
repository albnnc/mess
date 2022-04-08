import { mongo, nats } from "./deps.ts";

export interface TestEnvironmentOptions {
  ncUrl?: string;
  dbUrl?: string;
  dbName?: string;
  codec?: nats.Codec<unknown>;
}

export async function createTestEnvironment({
  ncUrl = Deno.env.get("NATS_URL") ?? "",
  dbUrl = Deno.env.get("MONGO_URL") ?? "",
  dbName = "TEST",
  codec = nats.JSONCodec<unknown>(),
}: TestEnvironmentOptions = {}) {
  const nc = await nats.connect({ servers: ncUrl });
  const mongoClient = new mongo.MongoClient();
  await mongoClient.connect(dbUrl);
  const db = mongoClient.database(dbName);
  const collections = await db.listCollectionNames();
  for (const v of collections) {
    await db.collection(v).drop().catch();
  }
  const dispose = async () => {
    await nc.close();
    await mongoClient.close();
  };
  return { nc, db, codec, dispose };
}
