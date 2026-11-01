import "server-only";
import { prisma } from "@/lib/prisma";
import type { AnalyticsEventInput } from "@/server/schemas/analytics";

export async function recordAnalyticsEvent(
  userId: string,
  input: AnalyticsEventInput
) {
  await prisma.usageEvent.create({
    data: {
      userId,
      event: input.event,
      metadata: input.metadata
        ? JSON.stringify(input.metadata).slice(0, 2000)
        : null,
    },
  });
}
