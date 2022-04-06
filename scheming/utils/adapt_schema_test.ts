import { assertEquals } from "../../testing/mod.ts";
import { adaptSchema } from "./adapt_schema.ts";

Deno.test("adapt schema", async (t) => {
  const defaultSchema = {
    type: "object",
    properties: {
      id: { type: "string", readOnly: true },
      username: { type: "string" },
      password: { type: "string", writeOnly: true },
      role: {
        type: "object",
        properties: {
          id: { type: "string", readOnly: true },
          name: { type: "string" },
        },
      },
    },
    required: ["id", "username", "password"],
  };
  const readSchema = {
    type: "object",
    properties: {
      id: { type: "string", readOnly: true },
      username: { type: "string" },
      role: {
        type: "object",
        properties: {
          id: { type: "string", readOnly: true },
          name: { type: "string" },
        },
      },
    },
    required: ["id", "username"],
  };
  const writeSchema = {
    type: "object",
    properties: {
      username: { type: "string" },
      password: { type: "string", writeOnly: true },
      role: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
    },
    required: ["username", "password"],
  };
  await t.step("remove read-only props in write mode", () => {
    assertEquals(adaptSchema(defaultSchema, "w"), writeSchema);
  });
  await t.step("remove write-only props in read mode", () => {
    assertEquals(adaptSchema(defaultSchema, "r"), readSchema);
  });
});
