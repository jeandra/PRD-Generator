"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiPlus,
  FiFileText,
  FiTrash2,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Reveal from "@/components/Reveal";

interface PrdItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

function SkeletonCard() {
  return (
    <div className="clay-surface-sm p-6 space-y-3">
      <div className="skeleton mb-3 h-6 w-2/3 rounded-2xl bg-[#ebdff5]" />
      <div className="skeleton mb-2 h-3.5 w-full rounded-xl bg-[#ebdff5]" />
      <div className="skeleton mb-4 h-3.5 w-4/5 rounded-xl bg-[#ebdff5]" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-4 w-24 rounded-full bg-[#ebdff5]" />
        <div className="skeleton h-4 w-16 rounded-full bg-[#ebdff5]" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prds, setPrds] = useState<PrdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PrdItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => setReloadKey((key) => key + 1);
  const totalPages = Math.max(1, Math.ceil(total / 12));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    const loadPrds = async () => {
      setFetching(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (debouncedQuery) params.set("q", debouncedQuery);
        const res = await fetch(`/api/prd?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (!cancelled) {
          setPrds(data.prds || []);
          setTotal(data.total || 0);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          toast.error("Gagal memuat data");
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
          setLoading(false);
        }
      }
    };

    loadPrds();
    return () => {
      cancelled = true;
    };
  }, [status, debouncedQuery, page, reloadKey]);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setDeleteTarget(null);
      setClosing(false);
    }, 180);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/prd/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("PRD berhasil dihapus");
        setPrds((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setTotal((prev) => Math.max(0, prev - 1));
        if (prds.length === 1 && page > 1) setPage(page - 1);
        closeModal();
      } else {
        toast.error("Gagal menghapus PRD");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48 rounded-2xl bg-[#ebdff5]" />
            <div className="skeleton h-4 w-64 rounded-xl bg-[#ebdff5]" />
          </div>
          <div className="skeleton h-11 w-36 rounded-full bg-[#ebdff5]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="anim-in mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#31224d]">Dashboard Saya</h1>
          <p className="text-sm font-medium text-[#5b467a]">
            Selamat datang kembali, <strong className="text-[#31224d]">{session?.user?.name}</strong>!
          </p>
        </div>
        <Link
          href="/prd/new"
          className="clay-btn-coral px-5 py-2.5 text-sm shadow-md"
        >
          <FiPlus /> Buat PRD Baru
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="anim-in mb-8 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8c74a8]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau ringkasan produk..."
            aria-label="Cari PRD"
            className="clay-pill-input w-full py-2.5 pl-11 pr-4 text-sm"
          />
        </div>
        {fetching && <span className="text-xs font-bold text-[#6a538a]">Memuat...</span>}
      </div>

      {/* Error Retry banner */}
      {error && !loading ? (
        <div className="anim-scale mb-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-sm">
          <p className="text-sm font-medium text-red-600">Gagal memuat daftar dokumen PRD.</p>
          <button
            type="button"
            onClick={handleRetry}
            disabled={fetching}
            className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
          >
            Coba Lagi
          </button>
        </div>
      ) : null}

      {/* Empty State */}
      {prds.length === 0 && !fetching ? (
        <div className="anim-scale text-center py-16 clay-surface p-8 max-w-xl mx-auto">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-inner text-[#ff6b57] mb-4">
            <FiFileText size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#31224d] mb-2">
            {debouncedQuery ? "Tidak ada PRD yang cocok" : "Belum ada dokumen PRD"}
          </h2>
          <p className="text-[#5b467a] font-medium text-sm mb-6 max-w-sm mx-auto">
            {debouncedQuery
              ? `Tidak ditemukan dokumen yang memuat kata kunci "${debouncedQuery}"`
              : "Mulai perjalanan produkmu dengan men-generate dokumen PRD pertamamu."}
          </p>
          <Link
            href="/prd/new"
            className="clay-btn-coral px-6 py-2.5 text-sm shadow-md inline-flex"
          >
            <FiPlus /> Buat PRD Sekarang
          </Link>
        </div>
      ) : (
        /* PRD Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prds.map((prd, index) => (
            <Reveal key={prd.id} delay={index * 50} className="h-full">
              <div className="clay-surface-sm p-6 h-full flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-200">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-[#31224d] line-clamp-1">
                      {prd.title}
                    </h3>
                    <button
                      onClick={() => {
                        setDeleteTarget(prd);
                        setClosing(false);
                      }}
                      className="p-1.5 rounded-full text-[#9c85b5] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      aria-label={`Hapus ${prd.title}`}
                      title="Hapus"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <p className="text-[#5b467a] text-xs font-medium line-clamp-2 mb-5 leading-relaxed">
                    {prd.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f2e7f7]">
                  <span className="text-[11px] font-bold text-[#8c74a8] flex items-center gap-1">
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
            </Reveal>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="mt-10 flex items-center justify-between px-2">
          <span className="text-xs font-bold text-[#6a538a]">
            Total {total} Dokumen PRD
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || fetching}
              className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-40"
            >
              <FiChevronLeft /> Sebelumnya
            </button>
            <span className="text-xs font-bold text-[#5b467a] px-2">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || fetching}
              className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-40"
            >
              Berikutnya <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`clay-surface w-full max-w-sm p-6 shadow-2xl transition-all duration-200 ${
              closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-500 shadow-inner">
              <FiAlertTriangle size={24} />
            </div>
            <h2 className="mb-1 text-center text-xl font-extrabold text-[#31224d]">
              Hapus PRD ini?
            </h2>
            <p className="mb-6 text-center text-xs font-medium text-[#5b467a]">
              &ldquo;{deleteTarget.title}&rdquo; akan dihapus permanen beserta seluruh riwayat versinya.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="clay-btn-white flex-1 py-2 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md transition-colors disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
