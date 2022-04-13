import { mongo, nats } from "../deps.ts";
import {
  createResponseHeaders,
  getErrorStatusCode,
  validateResponse,
} from "../utils/mod.ts";

export interface NoticingOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
  codec: nats.Codec<unknown>;
  entity: string;
}

export async function handleNoticing({
  nc,
  db,
  codec: _,
  entity,
}: NoticingOptions) {
  const sub = await nc.subscribe(`${entity}.*.REQUEST.NOTICE`);
  const collection = db.collection(entity);
  const handleSub = async () => {
    for await (const msg of sub) {
      const id = msg.subject.split(".")[1] ?? "UNKNOWN";
      try {
        const prior = await collection.findOne(
          { id },
          { projection: { _id: 0 } }
        );
        if (!prior) {
          const insertingMsg = await nc.request(
            `${entity}.${id}.REQUEST.INSERT`,
            msg.data
          );
          validateResponse(insertingMsg);
          msg.respond(nats.Empty, {
            headers: createResponseHeaders("200"),
          });
          continue;
        }
        // TODO: One has to build a patch here.
        const updatingMsg = await nc.request(
          `${entity}.${id}.REQUEST.UPDATE`,
          msg.data
        );
        validateResponse(updatingMsg);
        msg.respond(nats.Empty, {
          headers: createResponseHeaders("404"),
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
