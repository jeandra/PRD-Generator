"use client";

import { FiSliders, FiX } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";

export default function RefineSectionModal({
  open,
  sections,
  selectedSection,
  instruction,
  refining,
  shake,
  onSelect,
  onInstruction,
  onClose,
  onSubmit,
}: {
  open: boolean;
  sections: string[];
  selectedSection: string;
  instruction: string;
  refining: boolean;
  shake: boolean;
  onSelect: (section: string) => void;
  onInstruction: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div
        className={`clay-surface w-full max-w-lg space-y-4 p-7 shadow-2xl ${
          shake ? "anim-shake" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#ebdff5] pb-3">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#31224d]">
            <FiSliders className="text-[#7657d4]" /> Refine Section dengan AI
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8c74a8] hover:text-[#31224d]"
          >
            <FiX size={18} />
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#31224d]">
            Pilih Section yang Ingin Diperbaiki
          </label>
          <select
            value={selectedSection}
            onChange={(event) => onSelect(event.target.value)}
            className="clay-pill-input w-full cursor-pointer px-3.5 py-2.5 text-xs font-bold"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#31224d]">
            Instruksi Perbaikan Khusus
          </label>
          <textarea
            value={instruction}
            onChange={(event) => onInstruction(event.target.value)}
            placeholder="Contoh: Tambahkan requirements untuk autentikasi 2FA dan OAuth Google..."
            className="clay-pill-input h-28 w-full resize-none px-3.5 py-2.5 text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="clay-btn-white px-4 py-2 text-xs font-bold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={refining || !instruction.trim()}
            className="clay-btn-purple px-5 py-2 text-xs font-bold disabled:opacity-50"
          >
            {refining && <FiRefreshCw className="animate-spin" />}
            {refining ? "Memperbarui..." : "Terapkan Perbaikan AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
