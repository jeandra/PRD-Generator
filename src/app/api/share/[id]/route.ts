import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prd = await prisma.prd.findFirst({
      where: { id, isPublic: true },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!prd) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan atau tidak dibagikan untuk publik" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prd });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
