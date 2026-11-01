"use client";

import Markdown from "@/components/markdown/Markdown";
import type { PrdDetail } from "@/types/prd";

export default function PrdViewer({ prd }: { prd: PrdDetail }) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#ebdff5] pb-6">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold leading-tight text-[#31224d] sm:text-4xl">
            {prd.title}
          </h1>
          <p className="text-xs font-bold text-[#8c74a8]">
            Dibuat:{" "}
            {new Date(prd.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {new Date(prd.updatedAt).getTime() !==
              new Date(prd.createdAt).getTime() && (
              <>
                {" "}
                • Diperbarui:{" "}
                {new Date(prd.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </>
            )}
          </p>
        </div>
        {prd.isPublic && (
          <span className="clay-badge bg-[#e8f7ee] text-[#1e824c]">
            ● Tautan Publik Aktif
          </span>
        )}
      </div>
      <Markdown content={prd.content} className="prose max-w-none text-[#3b2d54]" />
    </div>
  );
}
