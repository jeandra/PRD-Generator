import { NextResponse, type NextRequest } from "next/server";
import { generatePrdContent } from "@/server/ai/gemini";
import { requireUserId } from "@/server/auth";
import { handleApiError } from "@/server/http";
import {
  getPrdForRegenerate,
  updatePrdContent,
} from "@/server/services/prd";
import { createPrdVersion } from "@/server/services/versions";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const prd = await getPrdForRegenerate(userId, id);
    await createPrdVersion(prd.id, prd.content);

    const content = await generatePrdContent(prd.input);
    const updated = await updatePrdContent(prd.id, content);

    return NextResponse.json({ prd: updated });
  } catch (error) {
    return handleApiError(error, "Gagal regenerate PRD");
  }
}
