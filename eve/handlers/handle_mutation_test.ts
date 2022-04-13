import {
  assertMatch,
  createTestEnvironment,
  getStreamMsgs,
} from "../../testing/mod.ts";
import { handleMutation } from "./handle_mutation.ts";

Deno.test("handle mutation", async (t) => {
  const { nc, codec, dispose } = await createTestEnvironment();
  await handleMutation({
    nc,
    codec,
    entity: "ENTITY",
    mutation: "MUTATION",
    pioneer: true,
    process: (id, v) => {
      if (typeof v !== "string") {
        throw new Error("Wrong type");
      }
      return { id };
    },
  });
  const getTestSubjects = async (input: unknown) => {
    const jsm = await nc.jetstreamManager();
    await jsm.streams.purge("ENTITY");
    await nc.request("ENTITY.REQUEST.MUTATION", codec.encode(input));
    const msgs = await getStreamMsgs(nc, "ENTITY");
    return msgs.map((v) => v.subject);
  };
  await t.step({
    name: "handle success",
    fn: async () => {
      const subjects = await getTestSubjects("");
      assertMatch(subjects[0], /^ENTITY\..+\.EVENT\.MUTATION\.ATTEMPT$/);
      assertMatch(subjects[1], /^ENTITY\..+\.EVENT\.MUTATION\.SUCCESS$/);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await t.step({
    name: "handle error",
    fn: async () => {
      const subjects = await getTestSubjects(null);
      assertMatch(subjects[0], /^ENTITY\..+\.EVENT\.MUTATION\.ATTEMPT$/);
      assertMatch(subjects[1], /^ENTITY\..+\.EVENT\.MUTATION\.ERROR$/);
    },
    sanitizeOps: false,
    sanitizeResources: false,
  });
  await dispose();
});
