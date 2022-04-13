import { assertEquals } from "../../testing/mod.ts";
import { excludeViaSchema } from "./exclude_via_schema.ts";

Deno.test("extract inaccessible", () => {
  const schema = {
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
  } as const;
  const data = {
    id: "",
    username: "",
    password: "",
    role: {
      id: "",
      name: "",
      abcd: "",
    },
  };
  assertEquals(
    excludeViaSchema(schema, data, {
      readOnly: true,
      writeOnly: true,
      additional: true,
    }),
    [
      {
        role: {
          name: "",
        },
        username: "",
      },
      {
        id: "",
        password: "",
        role: {
          id: "",
          abcd: "",
        },
      },
    ]
  );
});
