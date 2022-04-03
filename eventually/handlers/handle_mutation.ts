import { collections, nats } from "../deps.ts";
import { ensureStream } from "../utils/mod.ts";

export interface MutationOptions {
  nc: nats.NatsConnection;
  codec: nats.Codec<unknown>;
  streamName: string;
  subjectPrefix: string;
  process: (data: unknown) => unknown | Promise<unknown>;
}

export async function handleMutation({
  nc,
  codec,
  streamName,
  subjectPrefix,
  process,
}: MutationOptions) {
  const js = nc.jetstream();
  const requestSubject = subjectPrefix + "REQUEST.CREATE.DEFAULT";
  const eventSubjects = collections.mapValues(
    {
      attempt: "EVENT.CREATE.ATTEMPT",
      success: "EVENT.CREATE.SUCCESS",
      failed: "EVENT.CREATE.FAILED",
    },
    (v) => subjectPrefix + v
  );
  await ensureStream({
    nc,
    name: streamName,
    subjects: Object.values(eventSubjects),
  });
  const sub = await nc.subscribe(requestSubject);
  const handleSub = async () => {
    for await (const msg of sub) {
      await js.publish(eventSubjects.attempt, msg.data);
      try {
        const data = codec.decode(msg.data);
        const processed = await process(data);
        await js.publish(eventSubjects.success, codec.encode(processed));
      } catch (e) {
        await js.publish(eventSubjects.failed, codec.encode(e.toString()));
      }
      msg.respond();
    }
  };
  handleSub();
}
