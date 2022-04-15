export const deviceMetricLimitsSchema = {
  type: "object",
  properties: {
    warningMin: { type: "number" },
    warningMax: { type: "number" },
    criticalMin: { type: "number" },
    criticalMax: { type: "number" },
  },
} as const;
