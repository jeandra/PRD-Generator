"use client";

import Link from "next/link";
import { FiArrowRight, FiClock, FiTrash2 } from "react-icons/fi";
import type { PrdSummary } from "@/types/prd";

export default function PrdCard({
  prd,
  onDelete,
}: {
  prd: PrdSummary;
  onDelete: (prd: PrdSummary) => void;
}) {
  return (
    <div className="clay-surface-sm flex h-full flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-1.5">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold text-[#31224d]">
            {prd.title}
          </h3>
          <button
            type="button"
            onClick={() => onDelete(prd)}
            className="flex-shrink-0 rounded-full p-1.5 text-[#9c85b5] transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Hapus ${prd.title}`}
            title="Hapus"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
        <p className="mb-5 line-clamp-2 text-xs font-medium leading-relaxed text-[#5b467a]">
          {prd.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[#f2e7f7] pt-3">
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#8c74a8]">
          <FiClock size={12} />
          {new Date(prd.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <Link
          href={`/prd/${prd.id}`}
          className="clay-btn-white px-3.5 py-1.5 text-xs text-[#5b3b9b] hover:text-[#ff6b57]"
        >
          Buka PRD <FiArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
