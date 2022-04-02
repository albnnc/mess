import { assertEquals, createMessageRecorder } from "../../testing/mod.ts";
import { nats } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

Deno.test("handle mutation", async (t) => {
  const connection = await nats.connect({ servers: "nats://nats:4222" });
  const options: MutationOptions = {
    connection,
    codec: nats.JSONCodec(),
    subjectPrefix: "NUMERIC_ENTITY.",
    validate: (v: unknown) => {
      if (typeof v !== "number") {
        throw new Error();
      }
    },
  };
  handleMutation(options);

  await t.step({
    name: "handle success",
    fn: async () => {
      const recorder = createMessageRecorder({
        connection,
        subject: "NUMERIC_ENTITY.EVENT.>",
        count: 2,
        deadline: 100,
      });
      await connection.request(
        "NUMERIC_ENTITY.REQUEST.CREATE.DEFAULT",
        options.codec.encode(0)
      );
      await recorder.stopped;
      assertEquals(
        recorder.messages.map((v) => v.subject),
        [
          "NUMERIC_ENTITY.EVENT.CREATE.ATTEMPT",
          "NUMERIC_ENTITY.EVENT.CREATE.SUCCESS",
        ]
      );
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });

  await t.step({
    name: "handle failure",
    fn: async () => {
      const recorder = createMessageRecorder({
        connection,
        subject: "NUMERIC_ENTITY.EVENT.>",
        count: 2,
        deadline: 100,
      });
      await connection.request(
        "NUMERIC_ENTITY.REQUEST.CREATE.DEFAULT",
        options.codec.encode("")
      );
      await recorder.stopped;
      assertEquals(
        recorder.messages.map((v) => v.subject),
        [
          "NUMERIC_ENTITY.EVENT.CREATE.ATTEMPT",
          "NUMERIC_ENTITY.EVENT.CREATE.FAILED",
        ]
      );
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });

  await connection.close();
});
