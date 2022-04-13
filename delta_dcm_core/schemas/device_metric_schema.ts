import { deviceMetricLimitsSchema } from "./device_metric_limits_schema.ts";

export const deviceMetricSchema = {
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
    status: {
      type: "string",
      enum: ["OK", "WARNING", "CRITICAL"],
    },
    limits: deviceMetricLimitsSchema,
  },
  required: ["id", "deviceId", "name", "status"],
} as const;
