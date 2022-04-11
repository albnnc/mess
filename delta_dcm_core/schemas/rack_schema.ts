export const rackSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    roomId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },
  required: ["id", "roomId", "name"],
} as const;
