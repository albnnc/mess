import { pointSchema } from "./point_schema.ts";

export const roomSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    datacenterId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    geometry: {
      type: "array",
      items: pointSchema,
    },
  },
  required: ["id", "datacenterId", "name"],
} as const;
