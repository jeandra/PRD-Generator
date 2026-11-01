"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PRD_PAGE_SIZE } from "@/constants/prd";
import type { PrdListResponse } from "@/types/api";
import type { PrdSummary } from "@/types/prd";
import { useDebounce } from "./useDebounce";

export function usePrdList(status: string) {
  const [prds, setPrds] = useState<PrdSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    const loadPrds = async () => {
      setFetching(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (debouncedQuery) params.set("q", debouncedQuery);

        const res = await fetch(`/api/prd?${params}`);
        const data = (await res.json()) as PrdListResponse & {
          error?: string;
        };

        if (!res.ok) throw new Error(data.error);

        if (!cancelled) {
          setPrds(data.prds ?? []);
          setTotal(data.total ?? 0);
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

    void loadPrds();

    return () => {
      cancelled = true;
    };
  }, [status, debouncedQuery, page, reloadKey]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const removePrd = (id: string) => {
    setPrds((prev) => prev.filter((prd) => prd.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    if (prds.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return {
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
    totalPages: Math.max(1, Math.ceil(total / PRD_PAGE_SIZE)),
    reload: () => setReloadKey((key) => key + 1),
    removePrd,
  };
}
