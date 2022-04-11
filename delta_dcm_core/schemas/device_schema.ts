export const deviceSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    parentType: {
      type: "string",
      enum: ["DATACENTER", "ROOM", "RACK"],
    },
    parentId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },
  required: ["id", "parentType", "parentId", "name"],
} as const;
