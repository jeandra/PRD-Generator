import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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

    const versions = await prisma.prdVersion.findMany({
      where: { prdId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ versions });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

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
    const { versionId } = await req.json();

    if (!versionId || typeof versionId !== "string") {
      return NextResponse.json(
        { error: "versionId tidak valid" },
        { status: 400 }
      );
    }

    const prd = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!prd) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    const targetVersion = await prisma.prdVersion.findFirst({
      where: { id: versionId, prdId: id },
    });

    if (!targetVersion) {
      return NextResponse.json(
        { error: "Versi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Simpan konten saat ini ke riwayat versi sebelum memulihkan
    await prisma.prdVersion.create({
      data: {
        prdId: id,
        content: prd.content,
      },
    });

    const updated = await prisma.prd.update({
      where: { id },
      data: { content: targetVersion.content },
    });

    return NextResponse.json({
      prd: updated,
      message: "Versi berhasil dipulihkan",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
