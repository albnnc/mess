import { mongo, nats } from "../deps.ts";
import { createResponseHeaders } from "../utils/mod.ts";

export interface ReadingOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
  codec: nats.Codec<unknown>;
  entity: string;
}

export async function handleReading({ nc, db, codec, entity }: ReadingOptions) {
  const sub = await nc.subscribe(`${entity}.*.REQUEST.READ`);
  const collection = db.collection(entity);
  const handleSub = async () => {
    for await (const msg of sub) {
      const id = msg.subject.split(".")[1] ?? "UNKNOWN";
      try {
        const data = await collection.findOne(
          { id },
          { projection: { _id: 0 } }
        );
        if (!data) {
          msg.respond(nats.Empty, {
            headers: createResponseHeaders("404"),
          });
        }
        msg.respond(codec.encode(data), {
          headers: createResponseHeaders("200"),
        });
      } catch (e) {
        msg.respond(nats.Empty, {
          headers: createResponseHeaders("500", e.message),
        });
      }
    }
  };
  handleSub();
}
