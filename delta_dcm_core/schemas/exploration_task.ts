export const explorationTaskSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    adapterId: { type: "string" },
    cron: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
  },
  required: ["id", "adapterId", "cron", "name"],
} as const;
