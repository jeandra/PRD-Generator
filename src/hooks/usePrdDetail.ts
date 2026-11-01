"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics";
import type { PrdDetail, PrdVersionItem } from "@/types/prd";

export function usePrdDetail(id: string, status: string) {
  const router = useRouter();
  const [prd, setPrd] = useState<PrdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [refining, setRefining] = useState(false);
  const [versions, setVersions] = useState<PrdVersionItem[]>([]);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    const loadPrd = async () => {
      try {
        const res = await fetch(`/api/prd/${id}`);
        if (!res.ok) {
          toast.error("PRD tidak ditemukan");
          router.push("/dashboard");
          return;
        }

        const data = await res.json();
        if (!cancelled) setPrd(data.prd as PrdDetail);
      } catch {
        if (!cancelled) toast.error("Gagal memuat PRD");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPrd();

    return () => {
      cancelled = true;
    };
  }, [status, id, router]);

  const save = async (title: string, content: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        toast.error("Gagal menyimpan");
        return false;
      }

      const data = await res.json();
      setPrd(data.prd as PrdDetail);
      toast.success("PRD berhasil disimpan");
      return true;
    } catch {
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const regenerate = async () => {
    if (!prd) return;

    setRegenerating(true);
    try {
      const res = await fetch(`/api/prd/${id}/regenerate`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal regenerate");
        return;
      }

      setPrd(data.prd as PrdDetail);
      trackEvent("regenerate_completed");
      void loadVersions();
      toast.success("PRD berhasil di-generate ulang");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setRegenerating(false);
    }
  };

  const loadVersions = async () => {
    try {
      const res = await fetch(`/api/prd/${id}/versions`);
      const data = await res.json();
      if (res.ok) setVersions((data.versions ?? []) as PrdVersionItem[]);
    } catch {
      toast.error("Gagal memuat riwayat versi");
    }
  };

  const restoreVersion = async (versionId: string) => {
    setRestoringVersionId(versionId);
    try {
      const res = await fetch(`/api/prd/${id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal memulihkan versi");
        return;
      }

      setPrd(data.prd as PrdDetail);
      void loadVersions();
      toast.success("Versi berhasil dipulihkan!");
    } catch {
      toast.error("Terjadi kesalahan saat rollback");
    } finally {
      setRestoringVersionId(null);
    }
  };

  const togglePublic = async () => {
    if (!prd) return;

    const nextIsPublic = !prd.isPublic;

    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: nextIsPublic }),
      });

      if (!res.ok) {
        toast.error("Gagal mengubah status publik");
        return;
      }

      const data = await res.json();
      setPrd(data.prd as PrdDetail);

      if (nextIsPublic) {
        trackEvent("share_enabled");
        const shareUrl = `${window.location.origin}/share/${id}`;
        navigator.clipboard?.writeText(shareUrl).catch(() => {});
        toast.success("Tautan publik disalin ke clipboard!");
      } else {
        toast.success("Tautan publik dinonaktifkan (Privat)");
      }
    } catch {
      toast.error("Gagal mengubah status publik");
    }
  };

  const refine = async (sectionTitle: string, instruction: string) => {
    setRefining(true);
    try {
      const res = await fetch(`/api/prd/${id}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionTitle, instruction }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal refine section");
        return false;
      }

      setPrd(data.prd as PrdDetail);
      trackEvent("refine_completed", { section: sectionTitle });
      void loadVersions();
      toast.success(data.message || "Section berhasil diperbarui!");
      return true;
    } catch {
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setRefining(false);
    }
  };

  return {
    prd,
    loading,
    saving,
    regenerating,
    refining,
    versions,
    restoringVersionId,
    save,
    regenerate,
    loadVersions,
    restoreVersion,
    togglePublic,
    refine,
  };
}
