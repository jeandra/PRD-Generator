import type { PrdInput, PrdTemplate } from "@/types/prd";

const TEMPLATE_INSTRUCTIONS: Record<PrdTemplate, string> = {
  Standar:
    "Seimbangkan kebutuhan bisnis, pengalaman pengguna, dan detail teknis. Gunakan bahasa profesional yang mudah dipahami lintas fungsi.",
  Startup:
    "Fokus pada MVP, validasi masalah, eksperimen tercepat, prioritas Must/Should/Could, trade-off biaya, dan metrik traction. Pangkas detail enterprise yang belum diperlukan.",
  Enterprise:
    "Fokus pada governance, keamanan, auditability, scalability, reliability, role/permission, compliance, observability, dan dependensi lintas tim.",
  Mobile:
    "Fokus pada pengalaman iOS/Android, offline state, push notification, permission perangkat, responsive interaction, app lifecycle, analytics event, dan store release.",
  SaaS:
    "Fokus pada multi-tenancy, subscription/billing, onboarding, roles, workspace, usage limits, retention, integrations, dan admin operations.",
  Marketplace:
    "Fokus pada dua sisi supply-demand, katalog, discovery, transaksi, pembayaran, trust & safety, rating, dispute, dan fulfillment.",
};

function getTemplateInstructions(template?: string) {
  if (!template) return TEMPLATE_INSTRUCTIONS.Standar;
  return (
    TEMPLATE_INSTRUCTIONS[template as PrdTemplate] ?? TEMPLATE_INSTRUCTIONS.Standar
  );
}

export function buildPrompt(input: PrdInput) {
  return `Kamu adalah seorang Product Manager profesional. Buatkan dokumen PRD (Product Requirements Document) yang lengkap dan detail dalam bahasa Indonesia berdasarkan informasi berikut:

**Nama Produk:** ${input.title}
**Deskripsi Produk:** ${input.description}
**Target User:** ${input.targetUser}
**Masalah yang Diselesaikan:** ${input.problem}
**Fitur Utama:** ${input.features}
${input.timeline ? `**Timeline:** ${input.timeline}` : ""}
${input.constraints ? `**Constraints:** ${input.constraints}` : ""}
${input.metrics ? `**Success Metrics:** ${input.metrics}` : ""}

${input.template ? `Gunakan template berikut secara spesifik:\n${getTemplateInstructions(input.template)}\n\n` : ""}Buatkan PRD dengan struktur berikut (gunakan format Markdown):

# PRD: ${input.title}

## 1. Executive Summary
## 2. Problem Statement
## 3. Goals & Objectives
## 4. Target Users & Personas
## 5. User Stories
## 6. Functional Requirements
## 7. Non-Functional Requirements
## 8. Timeline & Milestones
## 9. Success Metrics
## 10. Out of Scope
## 11. Risks & Mitigations
## 12. Appendix
## 13. Technical Plan
## 14. Implementation Tasks

Pastikan setiap section memiliki konten yang detail, actionable, dan profesional. Gunakan bullet points, tabel, dan numbering yang rapi.

Untuk bagian 13 dan 14, tulis secukup mungkin sehingga agent coding (misalnya opencode) bisa langsung mengeksekusinya tanpa bertanya ulang:
- Section 13: stack & arsitektur yang disarankan, data model (entitas + field utama), endpoint/route penting, dan alasan tiap keputusan teknis. Sebutkan asumsi bila informasi kurang.
- Section 14: task berurutan dari fondasi (setup, data model) sampai fitur user-facing. Format tiap task: "- [ ] <judul> — <acceptance criteria>". Tandai dependensi antar task bila ada.`;
}
