"use client";

import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  value,
  onChange,
  fetching,
}: {
  value: string;
  onChange: (value: string) => void;
  fetching: boolean;
}) {
  return (
    <div className="anim-in mb-8 flex items-center gap-3">
      <div className="relative w-full max-w-md">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8c74a8]" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cari judul atau ringkasan produk..."
          aria-label="Cari PRD"
          className="clay-pill-input w-full py-2.5 pl-11 pr-4 text-sm"
        />
      </div>
      {fetching && (
        <span className="text-xs font-bold text-[#6a538a]">Memuat...</span>
      )}
    </div>
  );
}
