export const AI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
] as const;

export type AiModel = (typeof AI_MODELS)[number];

export function isRetryableAiError(error: unknown) {
  const status = (error as { status?: number })?.status;
  return status === 404 || status === 429 || status === 503;
}
