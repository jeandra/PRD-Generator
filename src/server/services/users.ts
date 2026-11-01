import "server-only";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/server/http";
import type { RegisterInput } from "@/server/schemas/auth";

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new ApiError(400, "Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });
}

export async function findOrCreateOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email,
      name: input.name?.trim() || "Pengguna Google",
      image: input.image ?? null,
      password: randomBytes(32).toString("hex"),
    },
  });
}
