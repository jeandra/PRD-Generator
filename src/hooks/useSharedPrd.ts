"use client";

import { useEffect, useState } from "react";
import type { SharedPrd } from "@/types/prd";

export function useSharedPrd(id: string) {
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
          if (!cancelled) {
            setError(data.error || "Dokumen tidak ditemukan");
          }
          return;
        }

        if (!cancelled) setPrd(data.prd as SharedPrd);
      } catch {
        if (!cancelled) setError("Gagal memuat dokumen");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadSharedPrd();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { prd, loading, error };
}
