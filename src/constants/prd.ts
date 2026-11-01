import type { PrdTemplate } from "@/types/prd";

export const PRD_PAGE_SIZE = 12;

export const PRD_MAX_CONTENT_LENGTH = 200_000;

export const PRD_RATE_LIMIT_MAX = 20;

export const PRD_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export const PRD_RATE_LIMIT_CLEANUP_MS = 24 * 60 * 60 * 1000;

export const PRD_INPUT_LIMITS = {
  title: 200,
  description: 2_000,
  targetUser: 1_000,
  problem: 2_000,
  features: 5_000,
  timeline: 1_000,
  constraints: 1_000,
  metrics: 1_000,
  template: 50,
} as const;

export const PRD_REQUIRED_FIELDS = [
  "title",
  "description",
  "targetUser",
  "problem",
  "features",
] as const;

export const PRD_TEMPLATES: ReadonlyArray<{
  value: PrdTemplate;
  label: string;
}> = [
  { value: "Standar", label: "Standar — lintas fungsi & seimbang" },
  { value: "Startup", label: "Startup — MVP & eksperimen cepat" },
  { value: "Enterprise", label: "Enterprise — governance & compliance" },
  { value: "Mobile", label: "Mobile — iOS/Android & lifecycle" },
  { value: "SaaS", label: "SaaS — multi-tenant & subscription" },
  { value: "Marketplace", label: "Marketplace — supply, demand & trust" },
];

export const PRD_TEMPLATE_VALUES = PRD_TEMPLATES.map(
  (template) => template.value
) as PrdTemplate[];

export const PRD_WIZARD_STEPS = [
  { title: "Info Produk", description: "Nama dan deskripsi produk" },
  { title: "Target & Masalah", description: "Target user dan masalah" },
  { title: "Fitur Utama", description: "Fitur produk utama" },
  { title: "Template & Detail", description: "Gaya PRD, timeline, metrics" },
] as const;

export const PRD_GENERATING_MESSAGES = [
  "Menganalisis kebutuhan produk...",
  "Menyusun struktur PRD profesional...",
  "Merumuskan technical plan & data model...",
  "Menyusun task list siap vibe-coding...",
  "Merapikan format dokumen...",
] as const;
