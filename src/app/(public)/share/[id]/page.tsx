"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiCopy, FiFileText } from "react-icons/fi";
import Markdown from "@/components/markdown/Markdown";
import { useClipboard } from "@/hooks/useClipboard";
import { useSharedPrd } from "@/hooks/useSharedPrd";

function SharePageContent() {
  const params = useParams();
  const id = params.id as string;
  const { prd, loading, error } = useSharedPrd(id);
  const { copy } = useClipboard();

  const copyContent = async () => {
    if (!prd) return;
    await copy(prd.content, "Markdown disalin ke clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7657d4]" />
      </div>
    );
  }

  if (error || !prd) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="clay-surface p-10">
          <div className="mb-4 inline-flex rounded-3xl bg-white p-4 text-[#ff6b57] shadow-inner">
            <FiFileText size={32} />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-[#31224d]">
            Dokumen Tidak Tersedia
          </h1>
          <p className="mb-6 text-sm font-medium text-[#5b467a]">
            {error ||
              "PRD ini bersifat privat atau tautan yang kamu akses salah."}
          </p>
          <Link
            href="/"
            className="clay-btn-coral inline-flex px-6 py-2.5 text-xs font-bold"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdff5] pb-4">
        <div>
          <span className="clay-badge bg-[#e8f7ee] text-[#1e824c]">
            ● Publik Read-Only
          </span>
          <p className="mt-2 text-xs font-bold text-[#8c74a8]">
            Dibagikan oleh{" "}
            <strong className="text-[#31224d]">{prd.user?.name}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={copyContent}
          className="clay-btn-white px-4 py-2 text-xs font-bold"
        >
          <FiCopy /> Salin Markdown
        </button>
      </div>

      <div className="clay-surface p-7 sm:p-12">
        <div className="mb-8 border-b border-[#ebdff5] pb-6">
          <h1 className="mb-2 text-3xl font-extrabold leading-tight text-[#31224d] sm:text-4xl">
            {prd.title}
          </h1>
          <p className="text-xs font-bold text-[#8c74a8]">
            Terakhir diperbarui:{" "}
            {new Date(prd.updatedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Markdown
          content={prd.content}
          className="prose max-w-none text-[#3b2d54]"
        />
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7657d4]" />
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
