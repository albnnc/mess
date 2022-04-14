import * as testing from "../../testing/mod.ts";
import { handleNoticing } from "./handle_noticing.ts";
import { handleInserting } from "./handle_inserting.ts";
import { handleUpdating } from "./handle_updating.ts";

const schema = {
  type: "object",
  properties: {
    a: { type: "string" },
    b: { type: "string" },
  },
} as const;

Deno.test("generic noticing", async () => {
  const { nc, db, codec, dispose } = await testing.createTestEnvironment();
  await handleInserting({
    nc,
    db,
    codec,
    entity: "ENTITY",
    schema,
  });
  await handleUpdating({
    nc,
    db,
    codec,
    entity: "ENTITY",
    schema,
  });
  await handleNoticing({
    nc,
    db,
    codec,
    entity: "ENTITY",
  });
  await nc.request("ENTITY.x.REQUEST.NOTICE", codec.encode({ a: "x", b: "x" }));
  await nc.request("ENTITY.x.REQUEST.NOTICE", codec.encode({ b: "y" }));
  const msgs = await testing.getStreamMsgs(nc, "ENTITY");
  const subjects = msgs.map((v) => v.subject);
  const data = await db
    .collection("ENTITY")
    .findOne({ id: "x" }, { projection: { _id: 0 } });
  testing.assertMatch(subjects[0], /^ENTITY\..+\.EVENT\.INSERT\.ATTEMPT$/);
  testing.assertMatch(subjects[1], /^ENTITY\..+\.EVENT\.INSERT\.SUCCESS$/);
  testing.assertMatch(subjects[2], /^ENTITY\..+\.EVENT\.UPDATE\.ATTEMPT$/);
  testing.assertMatch(subjects[3], /^ENTITY\..+\.EVENT\.UPDATE\.SUCCESS$/);
  testing.assertEquals(data, { id: "x", b: "y" });
  await dispose();
});
