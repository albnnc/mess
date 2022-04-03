import { assertEquals, getStreamMsgs } from "../../testing/mod.ts";
import { nats } from "../deps.ts";
import { CreationOptions, handleCreation } from "./handle_creation.ts";

Deno.test("handle creation", async (t) => {
  const nc = await nats.connect({ servers: Deno.env.get("TEST_NATS_SERVER") });
  const options: CreationOptions = {
    nc,
    codec: nats.JSONCodec(),
    streamName: "TEST",
    subjectPrefix: "TEST.",
    schema: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string", writeOnly: true },
      },
      required: ["username", "password"],
    },
  };
  const getTestMsgs = async (input: unknown) => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge(options.streamName);
    await nc.request(
      "TEST.REQUEST.CREATE.DEFAULT",
      options.codec.encode(input)
    );
    return getStreamMsgs(nc, options.streamName);
  };
  await handleCreation(options);
  await t.step({
    name: "handle success",
    fn: async () => {
      const input = { username: "", password: "" };
      const msgs = await getTestMsgs(input);
      assertEquals(
        msgs.map((v) => v.subject),
        ["TEST.EVENT.CREATE.ATTEMPT", "TEST.EVENT.CREATE.SUCCESS"]
      );
      const data = msgs.map(
        (v) => options.codec.decode(v.data) as Record<string, unknown>
      );
      assertEquals(data.length, 2);
      assertEquals(typeof data[1].id, "string");
      delete data[1].id;
      assertEquals(data[0], input);
      assertEquals(data[1], input);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle failure",
    fn: async () => {
      const msgs = await getTestMsgs(null);
      assertEquals(
        msgs.map((v) => v.subject),
        ["TEST.EVENT.CREATE.ATTEMPT", "TEST.EVENT.CREATE.FAILED"]
      );
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await nc.close();
});
