"use client";

import { FiDownload } from "react-icons/fi";
import type { RefObject } from "react";

export default function ExportMenu({
  open,
  containerRef,
  onToggle,
  onMarkdown,
  onPdf,
  onDocx,
}: {
  open: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onMarkdown: () => void;
  onPdf: () => void;
  onDocx: () => void;
}) {
  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
      >
        <FiDownload /> Export
      </button>
      {open && (
        <div
          role="menu"
          className="clay-surface-sm absolute right-0 z-20 mt-2 w-48 origin-top-right overflow-hidden p-1.5 shadow-xl"
        >
          <button
            role="menuitem"
            onClick={onMarkdown}
            className="block w-full rounded-xl px-3.5 py-2 text-left text-xs font-bold text-[#543d75] transition-colors hover:bg-[#f6eef9]"
          >
            Export Markdown (.md)
          </button>
          <button
            role="menuitem"
            onClick={onPdf}
            className="block w-full rounded-xl px-3.5 py-2 text-left text-xs font-bold text-[#543d75] transition-colors hover:bg-[#f6eef9]"
          >
            Export PDF
          </button>
          <button
            role="menuitem"
            onClick={onDocx}
            className="block w-full rounded-xl px-3.5 py-2 text-left text-xs font-bold text-[#543d75] transition-colors hover:bg-[#f6eef9]"
          >
            Export DOCX
          </button>
        </div>
      )}
    </div>
  );
}
