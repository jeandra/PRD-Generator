import { NextResponse, type NextRequest } from "next/server";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseJson } from "@/server/http";
import { analyticsEventSchema } from "@/server/schemas/analytics";
import { recordAnalyticsEvent } from "@/server/services/analytics";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const input = await parseJson(req, analyticsEventSchema);
    await recordAnalyticsEvent(userId, input);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Gagal mencatat event");
  }
}
