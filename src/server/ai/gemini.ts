import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import type { PrdInput } from "@/types/prd";
import { AI_MODELS, isRetryableAiError } from "./models";
import { buildPrompt } from "./prompt";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function generateText(prompt: string): Promise<string> {
  let lastError: unknown;

  for (const model of AI_MODELS) {
    try {
      const result = await genAI
        .getGenerativeModel({ model })
        .generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      console.error(`Gemini model "${model}" gagal:`, error);

      if (!isRetryableAiError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function generatePrdContent(input: PrdInput): Promise<string> {
  return generateText(buildPrompt(input));
}

export async function* streamPrdContent(
  input: PrdInput
): AsyncGenerator<string> {
  const prompt = buildPrompt(input);
  let lastError: unknown;

  for (const model of AI_MODELS) {
    let emitted = false;

    try {
      const result = await genAI
        .getGenerativeModel({ model })
        .generateContentStream({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

      for await (const chunk of result.stream) {
        const text =
          chunk.candidates?.[0]?.content?.parts
            ?.map((part) => part.text ?? "")
            .join("") ?? "";

        if (text) {
          emitted = true;
          yield text;
        }
      }

      return;
    } catch (error) {
      lastError = error;
      console.error(`Gemini stream model "${model}" gagal:`, error);

      if (emitted || !isRetryableAiError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
