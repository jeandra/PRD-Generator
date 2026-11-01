import "server-only";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/server/http";
import {
  PRD_RATE_LIMIT_CLEANUP_MS,
  PRD_RATE_LIMIT_MAX,
  PRD_RATE_LIMIT_WINDOW_MS,
} from "@/constants/prd";

export async function assertGenerateRateLimit(userId: string) {
  const key = `generate:${userId}`;
  const windowStart = new Date(Date.now() - PRD_RATE_LIMIT_WINDOW_MS);

  const count = await prisma.rateLimit.count({
    where: { key, createdAt: { gte: windowStart } },
  });

  if (count >= PRD_RATE_LIMIT_MAX) {
    throw new ApiError(
      429,
      `Batas ${PRD_RATE_LIMIT_MAX} generate per jam tercapai. Silakan coba lagi nanti.`,
      { "Retry-After": "3600" }
    );
  }

  await prisma.rateLimit.create({ data: { key } });

  void prisma.rateLimit
    .deleteMany({
      where: {
        createdAt: { lt: new Date(Date.now() - PRD_RATE_LIMIT_CLEANUP_MS) },
      },
    })
    .catch(() => {});
}
