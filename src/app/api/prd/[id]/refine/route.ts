import { NextResponse, type NextRequest } from "next/server";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseJson } from "@/server/http";
import { refineSectionSchema } from "@/server/schemas/prd";
import { refinePrdSection } from "@/server/services/refine";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const input = await parseJson(req, refineSectionSchema);
    const result = await refinePrdSection(userId, id, input);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "Gagal memperbaiki section dengan AI");
  }
}
