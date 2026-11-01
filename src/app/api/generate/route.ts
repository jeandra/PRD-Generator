import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { buildPrompt } from "@/lib/gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const encoder = new TextEncoder();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 20;

const LIMITS: [string, number, boolean][] = [
  ["title", 200, true],
  ["description", 2000, true],
  ["targetUser", 1000, true],
  ["problem", 2000, true],
  ["features", 5000, true],
  ["timeline", 1000, false],
  ["constraints", 1000, false],
  ["metrics", 1000, false],
  ["template", 50, false],
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
    }

    const input: Record<string, string> = {};
    for (const [field, max, required] of LIMITS) {
      const value =
        typeof body[field] === "string" ? (body[field] as string).trim() : "";

      if (required && !value) {
        return NextResponse.json(
          { error: `${field} wajib diisi` },
          { status: 400 }
        );
      }
      if (value.length > max) {
        return NextResponse.json(
          { error: `${field} maksimal ${max} karakter` },
          { status: 400 }
        );
      }
      input[field] = value;
    }

    // Database-backed rate limiting
    const windowStart = new Date(Date.now() - RATE_WINDOW_MS);
    const count = await prisma.rateLimit.count({
      where: {
        key: `generate:${userId}`,
        createdAt: { gte: windowStart },
      },
    });

    if (count >= RATE_MAX) {
      return NextResponse.json(
        {
          error: `Batas ${RATE_MAX} generate per jam tercapai. Silakan coba lagi nanti.`,
        },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }

    await prisma.rateLimit.create({
      data: { key: `generate:${userId}` },
    });

    // Cleanup record rate limit yang sudah kadaluarsa (> 24 jam) di latar belakang
    prisma.rateLimit
      .deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      })
      .catch(() => {});

    const prdInput = {
      title: input.title,
      description: input.description,
      targetUser: input.targetUser,
      problem: input.problem,
      features: input.features,
      timeline: input.timeline || undefined,
      constraints: input.constraints || undefined,
      metrics: input.metrics || undefined,
      template: input.template || undefined,
    };
    const prompt = buildPrompt(prdInput);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await genAI
            .getGenerativeModel({ model: "gemini-3.6-flash" })
            .generateContentStream({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

          let content = "";
          for await (const chunk of result.stream) {
            const partText = chunk.candidates?.[0]?.content?.parts
              ?.map((part) => part.text ?? "")
              .join("") ?? "";
            content += partText;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: partText })}\n\n`)
            );
          }

          const prd = await prisma.prd.create({
            data: {
              title: input.title,
              description: input.description,
              targetUser: input.targetUser,
              problem: input.problem,
              features: input.features,
              timeline: input.timeline || null,
              constraints: input.constraints || null,
              metrics: input.metrics || null,
        content,
        lastInput: JSON.stringify(prdInput),
        userId,
            },
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done", prd })}\n\n`)
          );
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      status: 201,
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
  } catch (error) {
    console.error("Generate PRD error:", error);
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? `: ${error.message}`
        : "";
    return NextResponse.json(
      { error: `Gagal generate PRD${detail}` },
      { status: 500 }
    );
  }
}
