export const searchRequestSchema = {
  type: "object",
  properties: {
    offset: {
      type: "number",
    },
    limit: {
      type: "number",
    },
    filter: {
      type: "string",
    },
  },
} as const;
