"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiClock,
  FiCopy,
  FiEdit3,
  FiRefreshCw,
  FiSave,
  FiShare2,
  FiSliders,
  FiX,
} from "react-icons/fi";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ExportMenu from "@/components/prd/detail/ExportMenu";
import PrdEditor from "@/components/prd/detail/PrdEditor";
import PrdViewer from "@/components/prd/detail/PrdViewer";
import RefineSectionModal from "@/components/prd/detail/RefineSectionModal";
import VersionHistoryPanel from "@/components/prd/detail/VersionHistoryPanel";
import { trackEvent } from "@/lib/analytics";
import { exportDocxFile, exportMarkdownFile, exportPdfFile } from "@/lib/export";
import { useClipboard } from "@/hooks/useClipboard";
import { usePrdDetail } from "@/hooks/usePrdDetail";

function PrdDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { status } = useSession();
  const detail = usePrdDetail(id, status);
  const { copy } = useClipboard();

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [refineModal, setRefineModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [refineInstruction, setRefineInstruction] = useState("");
  const [refineShake, setRefineShake] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<string | null>(null);

  const triggerRefineShake = () => {
    setRefineShake(true);
    setTimeout(() => setRefineShake(false), 500);
  };

  useEffect(() => {
    if (!exportOpen) return;

    const onClick = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [exportOpen]);

  const startEditing = () => {
    if (!detail.prd) return;
    setEditTitle(detail.prd.title);
    setEditContent(detail.prd.content);
    setEditing(true);
  };

  if (detail.loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7657d4]" />
      </div>
    );
  }

  if (!detail.prd) return null;

  const prd = detail.prd;

  const getAvailableSections = () =>
    prd.content
      .split("\n")
      .filter((line) => line.trim().startsWith("## "))
      .map((line) => line.replace(/^##\s+/, "").trim());

  const handleSave = async () => {
    const ok = await detail.save(editTitle, editContent);
    if (ok) {
      setEditing(false);
    }
  };

  const handleRegenerate = async () => {
    await detail.regenerate();
  };

  const handleRestoreVersion = (versionId: string) => {
    setVersionToRestore(versionId);
  };

  const confirmRestoreVersion = async () => {
    if (versionToRestore) {
      await detail.restoreVersion(versionToRestore);
      setVersionToRestore(null);
    }
  };

  const togglePublic = async () => {
    await detail.togglePublic();
  };

  const openRefineModal = () => {
    const sections = getAvailableSections();
    if (sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0]);
    }
    setRefineModal(true);
  };

  const handleRefine = async () => {
    if (!selectedSection || !refineInstruction.trim()) {
      triggerRefineShake();
      toast.error("Pilih section dan tuliskan instruksi");
      return;
    }

    const ok = await detail.refine(selectedSection, refineInstruction);
    if (ok) {
      setRefineModal(false);
      setRefineInstruction("");
    }
  };

  const handleCopyMarkdown = () => {
    void copy(prd.content, "Markdown disalin ke clipboard");
  };

  const handleExportMarkdown = () => {
    exportMarkdownFile(prd);
    trackEvent("exported", { format: "markdown" });
    toast.success("File .md berhasil didownload");
  };

  const handleExportPdf = () => {
    exportPdfFile(prd);
    trackEvent("exported", { format: "pdf" });
    toast.success("PDF berhasil didownload");
  };

  const handleExportDocx = async () => {
    await exportDocxFile(prd);
    trackEvent("exported", { format: "docx" });
    toast.success("DOCX berhasil didownload");
  };

  const toggleVersions = () => {
    setShowVersions((open) => {
      const next = !open;
      if (next) void detail.loadVersions();
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="clay-btn-white px-4 py-2 text-xs font-bold"
        >
          <FiArrowLeft /> Dashboard
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditContent(prd.content);
                  setEditTitle(prd.title);
                }}
                className="clay-btn-white px-4 py-2 text-xs font-bold text-gray-600"
              >
                <FiX /> Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={detail.saving}
                className="clay-btn-coral px-5 py-2 text-xs font-bold disabled:opacity-50"
              >
                <FiSave /> {detail.saving ? "Menyimpan..." : "Simpan Dokumen"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                title="Salin Markdown"
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
              >
                <FiCopy /> Copy
              </button>
              <button
                type="button"
                onClick={openRefineModal}
                className="clay-btn-purple px-4 py-1.5 text-xs font-bold"
              >
                <FiSliders /> AI Refine
              </button>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={detail.regenerating}
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-50"
              >
                <FiRefreshCw
                  className={detail.regenerating ? "animate-spin" : ""}
                />{" "}
                {detail.regenerating ? "Proses..." : "Regenerate"}
              </button>
              <button
                type="button"
                onClick={toggleVersions}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  showVersions
                    ? "clay-btn-purple"
                    : "clay-btn-white"
                }`}
              >
                <FiClock /> Versi
              </button>
              <button
                type="button"
                onClick={togglePublic}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  prd.isPublic
                    ? "clay-btn-coral"
                    : "clay-btn-white"
                }`}
                title={
                  prd.isPublic
                    ? "Klik untuk jadikan privat"
                    : "Klik untuk bagikan ke publik"
                }
              >
                <FiShare2 /> {prd.isPublic ? "Publik (Aktif)" : "Bagikan"}
              </button>
              <button
                type="button"
                onClick={startEditing}
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
              >
                <FiEdit3 /> Edit
              </button>
              <ExportMenu
                open={exportOpen}
                containerRef={exportRef}
                onToggle={() => setExportOpen((value) => !value)}
                onMarkdown={handleExportMarkdown}
                onPdf={handleExportPdf}
                onDocx={handleExportDocx}
              />
            </>
          )}
        </div>
      </div>

      {showVersions && (
        <VersionHistoryPanel
          versions={detail.versions}
          restoringVersionId={detail.restoringVersionId}
          onRestore={handleRestoreVersion}
          onClose={() => setShowVersions(false)}
        />
      )}

      <div className="clay-surface p-7 sm:p-12">
        {editing ? (
          <PrdEditor
            title={editTitle}
            content={editContent}
            onTitleChange={setEditTitle}
            onContentChange={setEditContent}
          />
        ) : (
          <PrdViewer prd={prd} />
        )}
      </div>

      <RefineSectionModal
        open={refineModal}
        sections={getAvailableSections()}
        selectedSection={selectedSection}
        instruction={refineInstruction}
        refining={detail.refining}
        shake={refineShake}
        onSelect={setSelectedSection}
        onInstruction={setRefineInstruction}
        onClose={() => setRefineModal(false)}
        onSubmit={handleRefine}
      />

      <ConfirmDialog
        open={versionToRestore !== null}
        title="Pulihkan versi ini?"
        description="Dokumen saat ini akan disimpan ke riwayat sebelum dipulihkan."
        confirmLabel="Pulihkan"
        destructive={false}
        loading={detail.restoringVersionId !== null}
        onCancel={() => setVersionToRestore(null)}
        onConfirm={confirmRestoreVersion}
      />
    </div>
  );
}

export default function PrdDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7657d4]" />
        </div>
      }
    >
      <PrdDetailContent />
    </Suspense>
  );
}
