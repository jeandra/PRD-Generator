import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_EVENTS = new Set([
  "generate_started",
  "generate_completed",
  "regenerate_completed",
  "refine_completed",
  "exported",
  "share_enabled",
  "demo_loaded",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (typeof body.event !== "string" || !ALLOWED_EVENTS.has(body.event)) {
      return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    await prisma.usageEvent.create({
      data: {
        userId,
        event: body.event,
        metadata:
          body.metadata && typeof body.metadata === "object"
            ? JSON.stringify(body.metadata).slice(0, 2000)
            : null,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal mencatat event" }, { status: 500 });
  }
}
