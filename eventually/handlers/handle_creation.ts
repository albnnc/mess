import { Ajv, nats } from "../deps.ts";

export interface CreationOptions {
  schema: Record<string, unknown>;
  codec: nats.Codec<Record<string, unknown>>;
  connection: nats.NatsConnection;
  subjectPrefix: string;
}

export async function handleCreation({
  schema,
  codec,
  connection,
  subjectPrefix,
}: CreationOptions) {
  const ajv = new Ajv({ strict: "log", allErrors: true });
  const validate = ajv.compile(schema);
  const subscription = connection.subscribe(
    subjectPrefix + "REQUEST.CREATE.DEFAULT"
  );
  for await (const message of subscription) {
    connection.publish(subjectPrefix + "EVENT.CREATE.ATTEMPT", message.data);
    try {
      const data = codec.decode(message.data);
      if (!validate(data)) {
        throw new Error(ajv.errorsText());
      }
      connection.publish(subjectPrefix + "EVENT.CREATE.SUCCESS", message.data);
    } catch (e) {
      connection.publish(
        subjectPrefix + "EVENT.CREATE.FAILED",
        codec.encode(e.toString())
      );
    }
  }
}
