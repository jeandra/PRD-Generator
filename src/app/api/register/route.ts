import { NextResponse, type NextRequest } from "next/server";
import { handleApiError, parseJson } from "@/server/http";
import { registerSchema } from "@/server/schemas/auth";
import { registerUser } from "@/server/services/users";

export async function POST(req: NextRequest) {
  try {
    const input = await parseJson(req, registerSchema);
    const user = await registerUser(input);

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "Terjadi kesalahan server");
  }
}
