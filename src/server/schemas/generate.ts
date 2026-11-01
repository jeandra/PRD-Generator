import { z } from "zod";
import {
  PRD_INPUT_LIMITS,
  PRD_TEMPLATE_VALUES,
} from "@/constants/prd";
import type { PrdTemplate } from "@/types/prd";

type TextField = Exclude<keyof typeof PRD_INPUT_LIMITS, "template">;

function requiredText(field: TextField, label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(
      PRD_INPUT_LIMITS[field],
      `${label} maksimal ${PRD_INPUT_LIMITS[field]} karakter`
    );
}

function optionalText(field: TextField, label: string) {
  return z
    .string()
    .trim()
    .max(
      PRD_INPUT_LIMITS[field],
      `${label} maksimal ${PRD_INPUT_LIMITS[field]} karakter`
    )
    .optional()
    .default("");
}

export const generatePrdSchema = z.object({
  title: requiredText("title", "Nama produk"),
  description: requiredText("description", "Deskripsi produk"),
  targetUser: requiredText("targetUser", "Target user"),
  problem: requiredText("problem", "Masalah"),
  features: requiredText("features", "Fitur"),
  timeline: optionalText("timeline", "Timeline"),
  constraints: optionalText("constraints", "Constraints"),
  metrics: optionalText("metrics", "Success metrics"),
  template: z
    .enum(PRD_TEMPLATE_VALUES as [PrdTemplate, ...PrdTemplate[]])
    .optional(),
});

export type GeneratePrdInput = z.infer<typeof generatePrdSchema>;
