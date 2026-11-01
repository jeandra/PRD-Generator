"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiCopy, FiFileText } from "react-icons/fi";
import { renderMarkdown } from "@/lib/markdown";

interface SharedPrd {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}

function SharePageContent() {
  const params = useParams();
  const id = params.id as string;
  const [prd, setPrd] = useState<SharedPrd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSharedPrd = async () => {
      try {
        const res = await fetch(`/api/share/${id}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Dokumen tidak ditemukan");
          return;
        }
        if (!cancelled) setPrd(data.prd);
      } catch {
        if (!cancelled) setError("Gagal memuat dokumen");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSharedPrd();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const copyContent = async () => {
    if (!prd) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prd.content);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = prd.content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      toast.success("Markdown disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7657d4]"></div>
      </div>
    );
  }

  if (error || !prd) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="clay-surface p-10">
          <div className="inline-flex p-4 bg-white shadow-inner rounded-3xl text-[#ff6b57] mb-4">
            <FiFileText size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#31224d] mb-2">Dokumen Tidak Tersedia</h1>
          <p className="text-[#5b467a] text-sm font-medium mb-6">
            {error || "PRD ini bersifat privat atau tautan yang kamu akses salah."}
          </p>
          <Link
            href="/"
            className="clay-btn-coral px-6 py-2.5 text-xs font-bold inline-flex"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#ebdff5]">
        <div>
          <span className="clay-badge bg-[#e8f7ee] text-[#1e824c]">
            ● Publik Read-Only
          </span>
          <p className="text-xs font-bold text-[#8c74a8] mt-2">
            Dibagikan oleh <strong className="text-[#31224d]">{prd.user?.name}</strong>
          </p>
        </div>
        <button
          onClick={copyContent}
          className="clay-btn-white px-4 py-2 text-xs font-bold"
        >
          <FiCopy /> Salin Markdown
        </button>
      </div>

      <div className="clay-surface p-7 sm:p-12">
        <div className="mb-8 pb-6 border-b border-[#ebdff5]">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#31224d] mb-2 leading-tight">
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
        <div className="prose max-w-none text-[#3b2d54]">{renderMarkdown(prd.content)}</div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7657d4]"></div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
