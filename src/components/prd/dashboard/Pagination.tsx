"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  page,
  totalPages,
  total,
  fetching,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  fetching: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (total <= 0) return null;

  return (
    <div className="mt-10 flex items-center justify-between px-2">
      <span className="text-xs font-bold text-[#6a538a]">
        Total {total} Dokumen PRD
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1 || fetching}
          className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-40"
        >
          <FiChevronLeft /> Sebelumnya
        </button>
        <span className="px-2 text-xs font-bold text-[#5b467a]">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages || fetching}
          className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-40"
        >
          Berikutnya <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
