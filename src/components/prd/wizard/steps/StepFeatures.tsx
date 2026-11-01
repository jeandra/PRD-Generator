import type { WizardStepProps } from "../types";

export default function StepFeatures({ form, onChange }: WizardStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Fitur-Fitur Utama <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.features}
          onChange={(event) => onChange("features", event.target.value)}
          className="clay-pill-input h-48 w-full resize-none px-4 py-3 font-mono text-sm"
          placeholder="Sebutkan fitur-fitur penting (satu per baris):&#10;- Otentikasi pengguna & peran&#10;- Dashboard analitik penjualan&#10;- Integrasi payment gateway"
        />
      </div>
    </div>
  );
}
