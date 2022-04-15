import { nats } from "../deps.ts";
import {
  createResponseHeaders,
  ensureStream,
  getErrorStatusCode,
} from "../utils/mod.ts";

export interface MutateOpOptions {
  nc: nats.NatsConnection;
  codec: nats.Codec<unknown>;
  entity: string;
  mutation: string;
  pioneer?: boolean;
  process: (id: string, data: unknown) => unknown | Promise<unknown>;
}

export async function handleMutateOp({
  nc,
  codec,
  entity,
  mutation,
  pioneer,
  process,
}: MutateOpOptions) {
  const requestSubject = pioneer
    ? `${entity}.REQUEST.${mutation}`
    : `${entity}.*.REQUEST.${mutation}`;
  const eventSubjects = {
    attempt: `${entity}.*.EVENT.${mutation}.ATTEMPT`,
    success: `${entity}.*.EVENT.${mutation}.SUCCESS`,
    error: `${entity}.*.EVENT.${mutation}.ERROR`,
  };
  await ensureStream({
    nc,
    name: entity,
    subjects: Object.values(eventSubjects),
  });
  const js = nc.jetstream();
  const sub = await nc.subscribe(requestSubject);
  const handleSub = async () => {
    for await (const msg of sub) {
      const id = pioneer
        ? crypto.randomUUID()
        : msg.subject.split(".")[1] ?? "UNKNOWN";
      await js.publish(eventSubjects.attempt.replace("*", id), msg.data);
      try {
        const decoded =
          msg.data.length > 0 ? codec.decode(msg.data) : undefined;
        const processed = await process(id, decoded);
        const encoded =
          processed !== undefined ? codec.encode(processed) : undefined;
        await js.publish(eventSubjects.success.replace("*", id), encoded);
        msg.respond(encoded, {
          headers: createResponseHeaders(pioneer ? "201" : "200"),
        });
      } catch (e) {
        await js.publish(
          eventSubjects.error.replace("*", id),
          codec.encode(e.message ?? String(e))
        );
        msg.respond(nats.Empty, {
          headers: createResponseHeaders(
            getErrorStatusCode(e),
            e.message || e.toString()
          ),
        });
      }
    }
  };
  handleSub();
}
