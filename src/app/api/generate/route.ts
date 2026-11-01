import { NextResponse, type NextRequest } from "next/server";
import { streamPrdContent } from "@/server/ai/gemini";
import { requireUserId } from "@/server/auth";
import { handleApiError, parseJson } from "@/server/http";
import { generatePrdSchema } from "@/server/schemas/generate";
import { createPrd } from "@/server/services/prd";
import { assertGenerateRateLimit } from "@/server/services/rate-limit";

const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const input = await parseJson(req, generatePrdSchema);
    await assertGenerateRateLimit(userId);

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let content = "";

          for await (const text of streamPrdContent(input)) {
            content += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }

          const prd = await createPrd(userId, input, content);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", prd })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error("Generate PRD stream error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      status: 201,
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
  } catch (error) {
    return handleApiError(error, "Gagal generate PRD");
  }
}
