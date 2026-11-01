import { PRD_TEMPLATES } from "@/constants/prd";
import type { PrdTemplate } from "@/types/prd";
import type { WizardStepProps } from "../types";

export default function StepTemplateDetails({
  form,
  onChange,
}: WizardStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Gaya & Template PRD
        </label>
        <select
          value={form.template}
          onChange={(event) =>
            onChange("template", event.target.value as PrdTemplate)
          }
          className="clay-pill-input w-full cursor-pointer px-4 py-3 text-sm font-bold"
        >
          {PRD_TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Target Timeline (Opsional)
        </label>
        <textarea
          value={form.timeline}
          onChange={(event) => onChange("timeline", event.target.value)}
          className="clay-pill-input h-20 w-full resize-none px-4 py-2.5 text-sm"
          placeholder="Contoh: Rilis MVP dalam 2 bulan, beta testing Q3 2025"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Batasan / Constraints (Opsional)
        </label>
        <textarea
          value={form.constraints}
          onChange={(event) => onChange("constraints", event.target.value)}
          className="clay-pill-input h-20 w-full resize-none px-4 py-2.5 text-sm"
          placeholder="Contoh: Harus mobile-first, tech stack Next.js + MySQL"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Success Metrics (Opsional)
        </label>
        <textarea
          value={form.metrics}
          onChange={(event) => onChange("metrics", event.target.value)}
          className="clay-pill-input h-20 w-full resize-none px-4 py-2.5 text-sm"
          placeholder="Contoh: 1.000 user aktif bulan pertama, 99.9% uptime"
        />
      </div>
    </div>
  );
}
