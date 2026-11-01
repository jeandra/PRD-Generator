import { NextResponse, type NextRequest } from "next/server";
import { handleApiError } from "@/server/http";
import { getPublicPrd } from "@/server/services/prd";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const prd = await getPublicPrd(id);

    return NextResponse.json({ prd });
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}
