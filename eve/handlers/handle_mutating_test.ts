import * as testing from "../../testing/mod.ts";
import { handleMutating } from "./handle_mutating.ts";

Deno.test("generic mutation", async () => {
  const { nc, codec, dispose } = await testing.createTestEnvironment();
  await handleMutating({
    nc,
    codec,
    entity: "ENTITY",
    mutation: "MUTATION",
    pioneer: true,
    process: (id: string, v: unknown) => {
      if (typeof v !== "string") {
        throw new Error("Wrong type");
      }
      return { id };
    },
  });
  await nc.request("ENTITY.REQUEST.MUTATION", codec.encode(""));
  await nc.request("ENTITY.REQUEST.MUTATION", codec.encode(null));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const subjects = msgs.map((v) => v.subject);
  testing.assertMatch(subjects[0], /^ENTITY\..+\.EVENT\.MUTATION\.ATTEMPT$/);
  testing.assertMatch(subjects[1], /^ENTITY\..+\.EVENT\.MUTATION\.SUCCESS$/);
  testing.assertMatch(subjects[2], /^ENTITY\..+\.EVENT\.MUTATION\.ATTEMPT$/);
  testing.assertMatch(subjects[3], /^ENTITY\..+\.EVENT\.MUTATION\.ERROR$/);
  await dispose();
});
