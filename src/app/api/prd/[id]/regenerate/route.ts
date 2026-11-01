import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePRDContent, type PrdInput } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const prd = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!prd) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    const input: PrdInput | null = prd.lastInput
      ? (JSON.parse(prd.lastInput) as PrdInput)
      : null;

    if (!input) {
      return NextResponse.json(
        { error: "Belum ada data generate sebelumnya" },
        { status: 400 }
      );
    }

    // Simpan versi saat ini sebelum generate ulang
    await prisma.prdVersion.create({
      data: { prdId: id, content: prd.content },
    });

    const content = await generatePRDContent(input);
    const updated = await prisma.prd.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json({ prd: updated });
  } catch (error) {
    console.error("Regenerate PRD error:", error);
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? `: ${error.message}`
        : "";
    return NextResponse.json(
      { error: `Gagal regenerate PRD${detail}` },
      { status: 500 }
    );
  }
}
