import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const query = req.nextUrl.searchParams.get("q")?.trim().slice(0, 100) ?? "";
    const page = Math.max(
      1,
      Number(req.nextUrl.searchParams.get("page")) || 1
    );

    const where = {
      userId,
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    };

    const [prds, total] = await Promise.all([
      prisma.prd.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.prd.count({ where }),
    ]);

    return NextResponse.json({ prds, total, page, pageSize: PAGE_SIZE });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
