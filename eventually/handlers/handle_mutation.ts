import { collections, nats } from "../deps.ts";

export interface MutationOptions {
  codec: nats.Codec<unknown>;
  connection: nats.NatsConnection;
  subjectPrefix: string;
  validate: (data: unknown) => void | Promise<void>;
}

export async function handleMutation({
  codec,
  connection,
  subjectPrefix,
  validate,
}: MutationOptions) {
  const subjects = collections.mapValues(
    {
      default: "REQUEST.CREATE.DEFAULT",
      attempt: "EVENT.CREATE.ATTEMPT",
      success: "EVENT.CREATE.SUCCESS",
      failed: "EVENT.CREATE.FAILED",
    },
    (v) => subjectPrefix + v
  );
  const subscription = connection.subscribe(subjects.default);
  for await (const message of subscription) {
    connection.publish(subjects.attempt, message.data);
    try {
      const data = codec.decode(message.data);
      await validate(data);
      connection.publish(subjects.success, message.data);
    } catch (e) {
      connection.publish(subjects.failed, codec.encode(e.toString()));
    }
    message.respond();
  }
}
