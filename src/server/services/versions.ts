import "server-only";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/server/http";
import type { PrdDetail, PrdVersionItem } from "@/types/prd";
import { findOwnedPrd, updatePrdContent } from "./prd";

export async function createPrdVersion(prdId: string, content: string) {
  await prisma.prdVersion.create({
    data: { prdId, content },
  });
}

export async function listPrdVersions(
  userId: string,
  prdId: string
): Promise<PrdVersionItem[]> {
  await findOwnedPrd(userId, prdId);

  const versions = await prisma.prdVersion.findMany({
    where: { prdId },
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, createdAt: true },
  });

  return versions.map((version) => ({
    id: version.id,
    content: version.content,
    createdAt: version.createdAt.toISOString(),
  }));
}

export async function restorePrdVersion(
  userId: string,
  prdId: string,
  versionId: string
): Promise<PrdDetail> {
  const prd = await findOwnedPrd(userId, prdId);

  const target = await prisma.prdVersion.findFirst({
    where: { id: versionId, prdId },
  });

  if (!target) {
    throw new ApiError(404, "Versi tidak ditemukan");
  }

  await createPrdVersion(prdId, prd.content);

  return updatePrdContent(prdId, target.content);
}
