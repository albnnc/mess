export const datacenterSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    location: {
      type: "array",
      items: [{ type: "number" }, { type: "number" }],
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["id", "name"],
} as const;
