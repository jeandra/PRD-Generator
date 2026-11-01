import type { WizardStepProps } from "../types";

export default function StepProductInfo({ form, onChange }: WizardStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(event) => onChange("title", event.target.value)}
          className="clay-pill-input w-full px-4 py-3 text-sm"
          placeholder="Contoh: GoFood, Catatanku, Slack"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Deskripsi Singkat Produk <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          className="clay-pill-input h-32 w-full resize-none px-4 py-3 text-sm"
          placeholder="Jelaskan secara ringkas tentang visi dan kegunaan produk..."
        />
      </div>
    </div>
  );
}
