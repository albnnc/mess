import { assertEquals, getStreamMsgs } from "../../testing/mod.ts";
import { nats } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

Deno.test("handle mutation", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("TEST_NATS_SERVER") });
  const options: MutationOptions = {
    nc,
    codec: nats.JSONCodec(),
    streamName: "TEST",
    subjectPrefix: "TEST.",
    validate: (v: unknown) => {
      if (typeof v !== "number") {
        throw new Error();
      }
    },
  };
  const getTestSubjects = async (input: unknown) => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge(options.streamName);
    await nc.request(
      "TEST.REQUEST.CREATE.DEFAULT",
      options.codec.encode(input)
    );
    const msgs = await getStreamMsgs(nc, options.streamName);
    return msgs.map((v) => v.subject);
  };
  await handleMutation(options);
  await t.step({
    name: "handle success",
    fn: async () => {
      assertEquals(await getTestSubjects(0), [
        "TEST.EVENT.CREATE.ATTEMPT",
        "TEST.EVENT.CREATE.SUCCESS",
      ]);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle failure",
    fn: async () => {
      assertEquals(await getTestSubjects(null), [
        "TEST.EVENT.CREATE.ATTEMPT",
        "TEST.EVENT.CREATE.FAILED",
      ]);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
});
