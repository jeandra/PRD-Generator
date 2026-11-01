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

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    const prd = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!prd) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ prd });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
    }

    const existing = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    const title =
      typeof body.title === "string" ? body.title.trim() : existing.title;
    const content =
      typeof body.content === "string" ? body.content : existing.content;
    const isPublic =
      typeof body.isPublic === "boolean" ? body.isPublic : existing.isPublic;

    if (!title) {
      return NextResponse.json(
        { error: "Judul tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Judul maksimal 200 karakter" },
        { status: 400 }
      );
    }

    if (content.length > 200000) {
      return NextResponse.json(
        { error: "Konten maksimal 200.000 karakter" },
        { status: 400 }
      );
    }

    // Jika konten berubah signifikan saat edit manual, simpan versi lama ke history
    if (body.content && body.content !== existing.content) {
      await prisma.prdVersion.create({
        data: { prdId: id, content: existing.content },
      });
    }

    const prd = await prisma.prd.update({
      where: { id },
      data: { title, content, isPublic },
    });

    return NextResponse.json({ prd });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    const existing = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    await prisma.prd.delete({ where: { id } });

    return NextResponse.json({ message: "PRD berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
