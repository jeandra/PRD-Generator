import { NextResponse, type NextRequest } from "next/server";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseData } from "@/server/http";
import { listPrdsQuerySchema } from "@/server/schemas/prd";
import { listPrds } from "@/server/services/prd";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();

    const query = parseData(
      {
        q: req.nextUrl.searchParams.get("q") ?? undefined,
        page: req.nextUrl.searchParams.get("page") ?? undefined,
      },
      listPrdsQuerySchema
    );

    const result = await listPrds(userId, query);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}
