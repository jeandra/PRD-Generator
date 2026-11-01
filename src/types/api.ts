import type { PrdSummary } from "@/types/prd";

export type ApiErrorBody = {
  error: string;
};

export type PrdListResponse = {
  prds: PrdSummary[];
  total: number;
  page: number;
  pageSize: number;
};
