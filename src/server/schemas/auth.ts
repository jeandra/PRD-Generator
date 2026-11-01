import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email wajib diisi")
    .max(254, "Email maksimal 254 karakter")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
