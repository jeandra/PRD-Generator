import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { ZodError, ZodType } from "zod";

export class ApiError extends Error {
  readonly status: number;
  readonly headers?: Record<string, string>;

  constructor(status: number, message: string, headers?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.headers = headers;
  }
}

export function jsonError(
  message: string,
  status: number,
  headers?: Record<string, string>
) {
  return NextResponse.json({ error: message }, { status, headers });
}

function firstIssueMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid";
}

export function parseData<T>(data: unknown, schema: ZodType<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(400, firstIssueMessage(result.error));
  }
  return result.data;
}

export async function parseJson<T>(
  req: NextRequest,
  schema: ZodType<T>
): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Body tidak valid");
  }
  return parseData(body, schema);
}

export function handleApiError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status, error.headers);
  }

  console.error(fallback, error);

  const detail =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? `: ${error.message}`
      : "";

  return jsonError(`${fallback}${detail}`, 500);
}
