import type { WizardStepProps } from "../types";

export default function StepTargetProblem({ form, onChange }: WizardStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Target Pengguna (User Persona){" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.targetUser}
          onChange={(event) => onChange("targetUser", event.target.value)}
          className="clay-pill-input h-28 w-full resize-none px-4 py-3 text-sm"
          placeholder="Siapa target pengguna produk ini? (contoh: mahasiswa usia 18-25 tahun, pekerja remote, UMKM)"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-[#31224d]">
          Masalah Utama yang Diselesaikan{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.problem}
          onChange={(event) => onChange("problem", event.target.value)}
          className="clay-pill-input h-28 w-full resize-none px-4 py-3 text-sm"
          placeholder="Masalah atau pain point apa yang ingin diatasi?"
        />
      </div>
    </div>
  );
}
