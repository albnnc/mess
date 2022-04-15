import * as testing from "../../testing/mod.ts";
import { handleMutateOp } from "./mutate.ts";

Deno.test("generic mutation", async () => {
  const { nc, codec, dispose } = await testing.createTestEnvironment();
  await handleMutateOp({
    nc,
    codec,
    entity: "ENTITY",
    mutation: "MUTATE",
    pioneer: true,
    process: (id: string, v: unknown) => {
      if (typeof v !== "string") {
        throw new Error("Wrong type");
      }
      return { id };
    },
  });
  await nc.request("ENTITY.REQUEST.MUTATE", codec.encode(""));
  await nc.request("ENTITY.REQUEST.MUTATE", codec.encode(null));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const subjects = msgs.map((v) => v.subject);
  testing.assertMatch(subjects[0], /^ENTITY\..+\.EVENT\.MUTATE\.ATTEMPT$/);
  testing.assertMatch(subjects[1], /^ENTITY\..+\.EVENT\.MUTATE\.SUCCESS$/);
  testing.assertMatch(subjects[2], /^ENTITY\..+\.EVENT\.MUTATE\.ATTEMPT$/);
  testing.assertMatch(subjects[3], /^ENTITY\..+\.EVENT\.MUTATE\.ERROR$/);
  await dispose();
});
