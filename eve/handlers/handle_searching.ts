import { mongo, nats, querying, scheming } from "../deps.ts";
import { searchRequestSchema } from "../schemas/mod.ts";
import { createResponseHeaders, getErrorStatusCode } from "../utils/mod.ts";

export interface SearchingOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
  codec: nats.Codec<unknown>;
  entity: string;
}

export async function handleSearching({
  nc,
  db,
  codec,
  entity,
}: SearchingOptions) {
  const sub = await nc.subscribe(`${entity}.REQUEST.SEARCH`);
  const collection = db.collection(entity);
  const handleSub = async () => {
    for await (const msg of sub) {
      try {
        const searchRequest = msg.data.length > 0 ? codec.decode(msg.data) : {};
        scheming.validateViaSchema(searchRequestSchema, searchRequest);
        const { offset = 0, limit = 100, filter = "" } = searchRequest;
        const data = await collection
          .find(querying.mongoizeFiql(filter), {
            skip: offset,
            limit,
            projection: { _id: 0 },
          })
          .toArray();
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
