import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/server/http";

export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  return session.user.id;
}
