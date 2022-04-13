export const devicePartSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    deviceId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    data: {
      type: "object",
    },
  },
  required: ["id", "deviceId", "name"],
} as const;
