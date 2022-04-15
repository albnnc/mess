export const adapterSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    name: { type: "string" },
    description: { type: "string" },
    clusterToken: { type: "string" },
    inputSchema: { type: "object" },
    inputDefaults: { type: "object" },
    outputSchema: { type: "object" },
    outputDefaults: { type: "object" },
  },
  required: ["id", "name", "clusterToken", "inputSchema", "outputSchema"],
} as const;
