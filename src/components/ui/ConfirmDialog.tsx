"use client";

import type { ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

type ConfirmDialogProps = {
  open: boolean;
  closing?: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  closing = false,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  loading = false,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`clay-surface w-full max-w-sm p-6 shadow-2xl transition-all duration-200 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${
            destructive
              ? "bg-red-100 text-red-500"
              : "bg-purple-100 text-[#7657d4]"
          }`}
        >
          <FiAlertTriangle size={24} />
        </div>
        <h2 className="mb-1 text-center text-xl font-extrabold text-[#31224d]">
          {title}
        </h2>
        <div className="mb-6 text-center text-xs font-medium text-[#5b467a]">
          {description}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="clay-btn-white flex-1 py-2 text-xs font-bold"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-full py-2 text-xs font-bold text-white shadow-md transition-colors disabled:opacity-60 ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#7657d4] hover:bg-[#6a4bc0]"
            }`}
          >
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
