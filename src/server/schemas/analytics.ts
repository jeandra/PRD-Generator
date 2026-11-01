import { z } from "zod";
import { ANALYTICS_EVENTS } from "@/constants/analytics";

export const analyticsEventSchema = z.object({
  event: z.enum(ANALYTICS_EVENTS),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
