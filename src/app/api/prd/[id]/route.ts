import { NextResponse, type NextRequest } from "next/server";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseJson } from "@/server/http";
import { updatePrdSchema } from "@/server/schemas/prd";
import {
  deletePrd,
  getPrdDetail,
  updatePrd,
} from "@/server/services/prd";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const prd = await getPrdDetail(userId, id);

    return NextResponse.json({ prd });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const input = await parseJson(req, updatePrdSchema);
    const prd = await updatePrd(userId, id, input);

    return NextResponse.json({ prd });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    await deletePrd(userId, id);

    return NextResponse.json({ message: "PRD berhasil dihapus" });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}
