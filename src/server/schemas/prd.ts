import { z } from "zod";
import { PRD_MAX_CONTENT_LENGTH } from "@/constants/prd";

export const listPrdsQuerySchema = z.object({
  q: z.string().trim().max(100, "Kata kunci maksimal 100 karakter").optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const updatePrdSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul tidak boleh kosong")
    .max(200, "Judul maksimal 200 karakter")
    .optional(),
  content: z
    .string()
    .max(
      PRD_MAX_CONTENT_LENGTH,
      `Konten maksimal ${PRD_MAX_CONTENT_LENGTH.toLocaleString("id-ID")} karakter`
    )
    .optional(),
  isPublic: z.boolean().optional(),
});

export const restoreVersionSchema = z.object({
  versionId: z.string().min(1, "versionId tidak valid"),
});

export const refineSectionSchema = z.object({
  sectionTitle: z.string().trim().min(1, "Nama section wajib diisi"),
  instruction: z.string().trim().min(1, "Instruksi perbaikan wajib diisi"),
});

export type ListPrdsQuery = z.infer<typeof listPrdsQuerySchema>;
export type UpdatePrdInput = z.infer<typeof updatePrdSchema>;
