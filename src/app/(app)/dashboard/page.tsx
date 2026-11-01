"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiFileText, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Reveal from "@/components/ui/Reveal";
import DashboardSkeleton from "@/components/prd/dashboard/DashboardSkeleton";
import Pagination from "@/components/prd/dashboard/Pagination";
import PrdCard from "@/components/prd/dashboard/PrdCard";
import SearchBar from "@/components/prd/dashboard/SearchBar";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { usePrdList } from "@/hooks/usePrdList";
import type { PrdSummary } from "@/types/prd";

export default function DashboardPage() {
  const status = useAuthGuard();
  const { data: session } = useSession();
  const {
    prds,
    loading,
    fetching,
    error,
    query,
    updateQuery,
    debouncedQuery,
    page,
    setPage,
    total,
    totalPages,
    reload,
    removePrd,
  } = usePrdList(status);

  const [deleteTarget, setDeleteTarget] = useState<PrdSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [closing, setClosing] = useState(false);

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
        removePrd(deleteTarget.id);
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
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="anim-in mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#31224d]">
            Dashboard Saya
          </h1>
          <p className="text-sm font-medium text-[#5b467a]">
            Selamat datang kembali,{" "}
            <strong className="text-[#31224d]">{session?.user?.name}</strong>!
          </p>
        </div>
        <Link
          href="/prd/new"
          className="clay-btn-coral px-5 py-2.5 text-sm shadow-md"
        >
          <FiPlus /> Buat PRD Baru
        </Link>
      </div>

      <SearchBar value={query} onChange={updateQuery} fetching={fetching} />

      {error && !loading ? (
        <div className="anim-scale mb-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-sm">
          <p className="text-sm font-medium text-red-600">
            Gagal memuat daftar dokumen PRD.
          </p>
          <button
            type="button"
            onClick={reload}
            disabled={fetching}
            className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Coba Lagi
          </button>
        </div>
      ) : null}

      {prds.length === 0 && !fetching ? (
        <div className="clay-surface anim-scale mx-auto max-w-xl p-8 py-16 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#ff6b57] shadow-inner">
            <FiFileText size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-extrabold text-[#31224d]">
            {debouncedQuery
              ? "Tidak ada PRD yang cocok"
              : "Belum ada dokumen PRD"}
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-sm font-medium text-[#5b467a]">
            {debouncedQuery
              ? `Tidak ditemukan dokumen yang memuat kata kunci "${debouncedQuery}"`
              : "Mulai perjalanan produkmu dengan men-generate dokumen PRD pertamamu."}
          </p>
          <Link
            href="/prd/new"
            className="clay-btn-coral inline-flex px-6 py-2.5 text-sm shadow-md"
          >
            <FiPlus /> Buat PRD Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prds.map((prd, index) => (
            <Reveal key={prd.id} delay={index * 50} className="h-full">
              <PrdCard
                prd={prd}
                onDelete={(target) => {
                  setDeleteTarget(target);
                  setClosing(false);
                }}
              />
            </Reveal>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        fetching={fetching}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() =>
          setPage((current) => Math.min(totalPages, current + 1))
        }
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        closing={closing}
        title="Hapus PRD ini?"
        description={
          <>
            &ldquo;{deleteTarget?.title}&rdquo; akan dihapus permanen beserta
            seluruh riwayat versinya.
          </>
        }
        confirmLabel="Ya, Hapus"
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
