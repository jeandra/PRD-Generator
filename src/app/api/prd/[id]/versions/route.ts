import { NextResponse, type NextRequest } from "next/server";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseJson } from "@/server/http";
import { restoreVersionSchema } from "@/server/schemas/prd";
import {
  listPrdVersions,
  restorePrdVersion,
} from "@/server/services/versions";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const versions = await listPrdVersions(userId, id);

    return NextResponse.json({ versions });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const { versionId } = await parseJson(req, restoreVersionSchema);
    const prd = await restorePrdVersion(userId, id, versionId);

    return NextResponse.json({
      prd,
      message: "Versi berhasil dipulihkan",
    });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}
