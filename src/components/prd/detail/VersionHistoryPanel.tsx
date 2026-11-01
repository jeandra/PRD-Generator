"use client";

import { FiClock, FiRotateCcw, FiX } from "react-icons/fi";
import type { PrdVersionItem } from "@/types/prd";

export default function VersionHistoryPanel({
  versions,
  restoringVersionId,
  onRestore,
  onClose,
}: {
  versions: PrdVersionItem[];
  restoringVersionId: string | null;
  onRestore: (versionId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="clay-surface mb-8 p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between border-b border-[#ebdff5] pb-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#31224d]">
          <FiClock className="text-[#7657d4]" /> Riwayat Versi Dokumen
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-[#8c74a8] hover:text-[#31224d]"
        >
          <FiX size={18} />
        </button>
      </div>

      {versions.length === 0 ? (
        <p className="text-xs font-medium text-[#7a6296]">
          Belum ada riwayat versi sebelumnya.
        </p>
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="clay-surface-sm flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <span className="clay-badge bg-[#f4eaf9] text-[#7657d4] text-[10px]">
                  Snapshot #{versions.length - index}
                </span>
                <p className="mt-1 text-[11px] font-bold text-[#8c74a8]">
                  {new Date(version.createdAt).toLocaleString("id-ID")}
                </p>
                <p className="mt-1 line-clamp-1 font-mono text-xs text-[#5b467a]">
                  {version.content.slice(0, 100)}...
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRestore(version.id)}
                disabled={restoringVersionId === version.id}
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-50"
              >
                <FiRotateCcw />
                {restoringVersionId === version.id
                  ? "Memulihkan..."
                  : "Pulihkan Versi"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
