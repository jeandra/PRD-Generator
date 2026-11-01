import "server-only";
import type { Prd, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PRD_PAGE_SIZE } from "@/constants/prd";
import { ApiError } from "@/server/http";
import type { GeneratePrdInput } from "@/server/schemas/generate";
import type { UpdatePrdInput } from "@/server/schemas/prd";
import type { PrdListResponse } from "@/types/api";
import type {
  PrdDetail,
  PrdInput,
  PrdSummary,
  SharedPrd,
} from "@/types/prd";

const summarySelect = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PrdSelect;

type PrdSummaryRow = Prisma.PrdGetPayload<{ select: typeof summarySelect }>;

const iso = (date: Date) => date.toISOString();

function toSummaryDto(row: PrdSummaryRow): PrdSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

export function toDetailDto(prd: Prd): PrdDetail {
  return {
    id: prd.id,
    title: prd.title,
    description: prd.description,
    targetUser: prd.targetUser,
    problem: prd.problem,
    features: prd.features,
    timeline: prd.timeline,
    constraints: prd.constraints,
    metrics: prd.metrics,
    content: prd.content,
    isPublic: prd.isPublic,
    createdAt: iso(prd.createdAt),
    updatedAt: iso(prd.updatedAt),
  };
}

export async function listPrds(
  userId: string,
  query: { q: string; page: number }
): Promise<PrdListResponse> {
  const where: Prisma.PrdWhereInput = {
    userId,
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q } },
            { description: { contains: query.q } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.prd.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * PRD_PAGE_SIZE,
      take: PRD_PAGE_SIZE,
      select: summarySelect,
    }),
    prisma.prd.count({ where }),
  ]);

  return {
    prds: rows.map(toSummaryDto),
    total,
    page: query.page,
    pageSize: PRD_PAGE_SIZE,
  };
}

export async function findOwnedPrd(userId: string, id: string): Promise<Prd> {
  const prd = await prisma.prd.findFirst({ where: { id, userId } });

  if (!prd) {
    throw new ApiError(404, "PRD tidak ditemukan");
  }

  return prd;
}

export async function getPrdDetail(
  userId: string,
  id: string
): Promise<PrdDetail> {
  return toDetailDto(await findOwnedPrd(userId, id));
}

export async function updatePrd(
  userId: string,
  id: string,
  input: UpdatePrdInput
): Promise<PrdDetail> {
  const existing = await findOwnedPrd(userId, id);

  const title = input.title ?? existing.title;
  const content = input.content ?? existing.content;
  const isPublic = input.isPublic ?? existing.isPublic;

  if (input.content !== undefined && input.content !== existing.content) {
    await prisma.prdVersion.create({
      data: { prdId: id, content: existing.content },
    });
  }

  const prd = await prisma.prd.update({
    where: { id },
    data: { title, content, isPublic },
  });

  return toDetailDto(prd);
}

export async function deletePrd(userId: string, id: string) {
  await findOwnedPrd(userId, id);
  await prisma.prd.delete({ where: { id } });
}

export async function createPrd(
  userId: string,
  input: GeneratePrdInput,
  content: string
): Promise<PrdSummary> {
  const prdInput: PrdInput = {
    title: input.title,
    description: input.description,
    targetUser: input.targetUser,
    problem: input.problem,
    features: input.features,
    timeline: input.timeline || undefined,
    constraints: input.constraints || undefined,
    metrics: input.metrics || undefined,
    template: input.template,
  };

  const prd = await prisma.prd.create({
    data: {
      title: input.title,
      description: input.description,
      targetUser: input.targetUser,
      problem: input.problem,
      features: input.features,
      timeline: input.timeline || null,
      constraints: input.constraints || null,
      metrics: input.metrics || null,
      content,
      lastInput: JSON.stringify(prdInput),
      userId,
    },
    select: summarySelect,
  });

  return toSummaryDto(prd);
}

export async function getPrdForRegenerate(userId: string, id: string) {
  const prd = await prisma.prd.findFirst({
    where: { id, userId },
    select: { id: true, content: true, lastInput: true },
  });

  if (!prd) {
    throw new ApiError(404, "PRD tidak ditemukan");
  }

  if (!prd.lastInput) {
    throw new ApiError(400, "Belum ada data generate sebelumnya");
  }

  let input: PrdInput;
  try {
    input = JSON.parse(prd.lastInput) as PrdInput;
  } catch {
    throw new ApiError(400, "Data generate sebelumnya tidak valid");
  }

  return { id: prd.id, content: prd.content, input };
}

export async function updatePrdContent(
  id: string,
  content: string
): Promise<PrdDetail> {
  const prd = await prisma.prd.update({
    where: { id },
    data: { content },
  });

  return toDetailDto(prd);
}

export async function getPublicPrd(id: string): Promise<SharedPrd> {
  const prd = await prisma.prd.findFirst({
    where: { id, isPublic: true },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { name: true } },
    },
  });

  if (!prd) {
    throw new ApiError(
      404,
      "Dokumen tidak ditemukan atau tidak dibagikan untuk publik"
    );
  }

  return {
    id: prd.id,
    title: prd.title,
    content: prd.content,
    createdAt: iso(prd.createdAt),
    updatedAt: iso(prd.updatedAt),
    user: { name: prd.user.name },
  };
}
