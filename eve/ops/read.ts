import { mongo, nats } from "../deps.ts";
import { createResponseHeaders, getErrorStatusCode } from "../utils/mod.ts";

export interface ReadOpOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
  codec: nats.Codec<unknown>;
  entity: string;
}

export async function handleReadOp({ nc, db, codec, entity }: ReadOpOptions) {
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
          headers: createResponseHeaders(getErrorStatusCode(e), e.message),
        });
      }
    }
  };
  handleSub();
}
