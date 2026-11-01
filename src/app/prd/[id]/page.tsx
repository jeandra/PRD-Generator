"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit3,
  FiSave,
  FiDownload,
  FiX,
  FiCopy,
  FiRefreshCw,
  FiClock,
  FiShare2,
  FiSliders,
  FiRotateCcw,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { renderMarkdown } from "@/lib/markdown";
import { trackEvent } from "@/lib/analytics";

interface PrdData {
  id: string;
  title: string;
  description: string;
  targetUser: string;
  problem: string;
  features: string;
  content: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VersionItem {
  id: string;
  content: string;
  createdAt: string;
}

function PrdDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { status } = useSession();
  const router = useRouter();

  const [prd, setPrd] = useState<PrdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const [regenerating, setRegenerating] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // Modal Refine per section
  const [refineModal, setRefineModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [refineInstruction, setRefineInstruction] = useState("");
  const [refining, setRefining] = useState(false);
  const [refineShake, setRefineShake] = useState(false); 

  const triggerRefineShake = () => {
    setRefineShake(true);
    setTimeout(() => setRefineShake(false), 500);
  };

  useEffect(() => {
    if (!exportOpen) return;

    const onClick = (event: MouseEvent) => {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setExportOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [exportOpen]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        if (!cancelled) {
          setPrd(data.prd);
          setEditContent(data.prd.content);
          setEditTitle(data.prd.title);
        }
      } catch {
        if (!cancelled) toast.error("Gagal memuat PRD");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPrd();
    return () => {
      cancelled = true;
    };
  }, [status, id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (res.ok) {
        const data = await res.json();
        setPrd(data.prd);
        setEditing(false);
        toast.success("PRD berhasil disimpan");
      } else {
        toast.error("Gagal menyimpan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!prd) return;

    setRegenerating(true);
    try {
      const res = await fetch(`/api/prd/${id}/regenerate`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setPrd({ ...prd, content: data.prd.content });
        setEditContent(data.prd.content);
        trackEvent("regenerate_completed");
        if (showVersions) loadVersions();
        toast.success("PRD berhasil di-generate ulang");
      } else {
        toast.error(data.error || "Gagal regenerate");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setRegenerating(false);
    }
  };

  const loadVersions = async () => {
    if (!prd) return;
    try {
      const res = await fetch(`/api/prd/${id}/versions`);
      const data = await res.json();
      if (res.ok) {
        setVersions(data.versions || []);
      }
    } catch {
      toast.error("Gagal memuat riwayat versi");
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm("Pulihkan versi ini? Dokumen saat ini akan disimpan ke riwayat.")) return;
    setRestoringVersionId(versionId);
    try {
      const res = await fetch(`/api/prd/${id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPrd(data.prd);
        setEditContent(data.prd.content);
        loadVersions();
        toast.success("Versi berhasil dipulihkan!");
      } else {
        toast.error(data.error || "Gagal memulihkan versi");
      }
    } catch {
      toast.error("Terjadi kesalahan saat rollback");
    } finally {
      setRestoringVersionId(null);
    }
  };

  const togglePublicShare = async () => {
    if (!prd) return;
    const newPublicStatus = !prd.isPublic;
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newPublicStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrd(data.prd);
        if (newPublicStatus) {
          trackEvent("share_enabled");
          const shareUrl = `${window.location.origin}/share/${id}`;
          navigator.clipboard?.writeText(shareUrl);
          toast.success("Tautan publik disalin ke clipboard!");
        } else {
          toast.success("Tautan publik dinonaktifkan (Privat)");
        }
      }
    } catch {
      toast.error("Gagal mengubah status publik");
    }
  };

  const getAvailableSections = () => {
    if (!prd) return [];
    return prd.content
      .split("\n")
      .filter((line) => line.trim().startsWith("## "))
      .map((line) => line.replace(/^##\s+/, "").trim());
  };

  const handleRefine = async () => {
    if (!selectedSection || !refineInstruction.trim()) {
      triggerRefineShake();
      toast.error("Pilih section dan tuliskan instruksi");
      return;
    }
    setRefining(true);
    try {
      const res = await fetch(`/api/prd/${id}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionTitle: selectedSection,
          instruction: refineInstruction,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPrd(data.prd);
        setEditContent(data.prd.content);
        setRefineModal(false);
        setRefineInstruction("");
        trackEvent("refine_completed", { section: selectedSection });
        if (showVersions) loadVersions();
        toast.success(data.message || "Section berhasil diperbarui!");
      } else {
        toast.error(data.error || "Gagal refine section");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setRefining(false);
    }
  };

  const copyMarkdown = async () => {
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
      toast.error("Gagal menyalin markdown");
    }
  };

  const exportMarkdown = () => {
    if (!prd) return;
    const blob = new Blob([prd.content], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${prd.title}.md`);
    trackEvent("exported", { format: "markdown" });
    toast.success("File .md berhasil didownload");
  };

  const exportPDF = () => {
    if (!prd) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    doc.setFontSize(18);
    doc.text(prd.title, margin, 30);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Dibuat: ${new Date(prd.createdAt).toLocaleDateString("id-ID")}`,
      margin,
      40
    );

    doc.setTextColor(0);
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(prd.content, maxWidth);
    let y = 50;

    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      if (line.startsWith("# ") || line.startsWith("## ")) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        y += 4;
      } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
      }

      doc.text(line, margin, y);
      y += 6;
    }

    doc.save(`${prd.title}.pdf`);
    trackEvent("exported", { format: "pdf" });
    toast.success("PDF berhasil didownload");
  };

  const exportDOCX = async () => {
    if (!prd) return;

    const contentLines = prd.content.split("\n");
    const children: Paragraph[] = [];

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: prd.title,
            bold: true,
            size: 36,
          }),
        ],
        heading: HeadingLevel.TITLE,
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Dibuat: ${new Date(prd.createdAt).toLocaleDateString("id-ID")}`,
            size: 20,
            color: "666666",
          }),
        ],
      })
    );

    children.push(new Paragraph({ text: "" }));

    for (const line of contentLines) {
      if (line.startsWith("# ")) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: line.replace("# ", ""), bold: true, size: 32 }),
            ],
            heading: HeadingLevel.HEADING_1,
          })
        );
      } else if (line.startsWith("## ")) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: line.replace("## ", ""), bold: true, size: 28 }),
            ],
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (line.startsWith("### ")) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: line.replace("### ", ""), bold: true, size: 24 }),
            ],
            heading: HeadingLevel.HEADING_3,
          })
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line.slice(2), size: 22 })],
            bullet: { level: 0 },
          })
        );
      } else if (line.trim() === "") {
        children.push(new Paragraph({ text: "" }));
      } else {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 22 })],
          })
        );
      }
    }

    const doc = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${prd.title}.docx`);
    trackEvent("exported", { format: "docx" });
    toast.success("DOCX berhasil didownload");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7657d4]"></div>
      </div>
    );
  }

  if (!prd) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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
                onClick={handleSave}
                disabled={saving}
                className="clay-btn-coral px-5 py-2 text-xs font-bold disabled:opacity-50"
              >
                <FiSave /> {saving ? "Menyimpan..." : "Simpan Dokumen"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={copyMarkdown}
                title="Salin Markdown"
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
              >
                <FiCopy /> Copy
              </button>
              <button
                onClick={() => {
                  const sections = getAvailableSections();
                  if (sections.length > 0 && !selectedSection) {
                    setSelectedSection(sections[0]);
                  }
                  setRefineModal(true);
                }}
                className="clay-btn-purple px-4 py-1.5 text-xs font-bold"
              >
                <FiSliders /> AI Refine
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-50"
              >
                <FiRefreshCw className={regenerating ? "animate-spin" : ""} />{" "}
                {regenerating ? "Proses..." : "Regenerate"}
              </button>
              <button
                onClick={() => {
                  setShowVersions(!showVersions);
                  if (!showVersions) loadVersions();
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                  showVersions
                    ? "clay-btn-purple"
                    : "clay-btn-white"
                }`}
              >
                <FiClock /> Versi
              </button>
              <button
                onClick={togglePublicShare}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                  prd.isPublic
                    ? "clay-btn-coral"
                    : "clay-btn-white"
                }`}
                title={prd.isPublic ? "Klik untuk jadikan privat" : "Klik untuk bagikan ke publik"}
              >
                <FiShare2 /> {prd.isPublic ? "Publik (Aktif)" : "Bagikan"}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
              >
                <FiEdit3 /> Edit
              </button>
              <div className="relative" ref={exportRef}>
                <button
                  type="button"
                  onClick={() => setExportOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={exportOpen}
                  className="clay-btn-white px-3.5 py-1.5 text-xs font-bold"
                >
                  <FiDownload /> Export
                </button>
                {exportOpen && (
                  <div
                    role="menu"
                    className="clay-surface-sm absolute right-0 z-20 mt-2 w-48 p-1.5 shadow-xl origin-top-right overflow-hidden"
                  >
                    <button
                      role="menuitem"
                      onClick={() => {
                        setExportOpen(false);
                        exportMarkdown();
                      }}
                      className="block w-full text-left px-3.5 py-2 text-xs font-bold text-[#543d75] hover:bg-[#f6eef9] rounded-xl transition-colors"
                    >
                      Export Markdown (.md)
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setExportOpen(false);
                        exportPDF();
                      }}
                      className="block w-full text-left px-3.5 py-2 text-xs font-bold text-[#543d75] hover:bg-[#f6eef9] rounded-xl transition-colors"
                    >
                      Export PDF
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setExportOpen(false);
                        exportDOCX();
                      }}
                      className="block w-full text-left px-3.5 py-2 text-xs font-bold text-[#543d75] hover:bg-[#f6eef9] rounded-xl transition-colors"
                    >
                      Export DOCX
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Panel Riwayat Versi & Rollback */}
      {showVersions && (
        <div className="clay-surface mb-8 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ebdff5]">
            <h2 className="text-lg font-extrabold text-[#31224d] flex items-center gap-2">
              <FiClock className="text-[#7657d4]" /> Riwayat Versi Dokumen
            </h2>
            <button
              onClick={() => setShowVersions(false)}
              className="text-[#8c74a8] hover:text-[#31224d]"
            >
              <FiX size={18} />
            </button>
          </div>
          {versions.length === 0 ? (
            <p className="text-xs font-medium text-[#7a6296]">Belum ada riwayat versi sebelumnya.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {versions.map((v, index) => (
                <div
                  key={v.id}
                  className="clay-surface-sm p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <span className="clay-badge bg-[#f4eaf9] text-[#7657d4] text-[10px]">
                      Snapshot #{versions.length - index}
                    </span>
                    <p className="text-[11px] font-bold text-[#8c74a8] mt-1">
                      {new Date(v.createdAt).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-[#5b467a] line-clamp-1 mt-1 font-mono">
                      {v.content.slice(0, 100)}...
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestoreVersion(v.id)}
                    disabled={restoringVersionId === v.id}
                    className="clay-btn-white px-3.5 py-1.5 text-xs font-bold disabled:opacity-50"
                  >
                    <FiRotateCcw />
                    {restoringVersionId === v.id ? "Memulihkan..." : "Pulihkan Versi"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Refine Section dengan AI */}
      {refineModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        >
          <div className={`clay-surface w-full max-w-lg p-7 shadow-2xl space-y-4 ${refineShake ? "anim-shake" : ""}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#ebdff5]">
              <h3 className="text-lg font-extrabold text-[#31224d] flex items-center gap-2">
                <FiSliders className="text-[#7657d4]" /> Refine Section dengan AI
              </h3>
              <button
                onClick={() => setRefineModal(false)}
                className="text-[#8c74a8] hover:text-[#31224d]"
              >
                <FiX size={18} />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#31224d] mb-1.5">
                Pilih Section yang Ingin Diperbaiki
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="clay-pill-input w-full px-3.5 py-2.5 text-xs font-bold cursor-pointer"
              >
                {getAvailableSections().map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#31224d] mb-1.5">
                Instruksi Perbaikan Khusus
              </label>
              <textarea
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                placeholder="Contoh: Tambahkan requirements untuk autentikasi 2FA dan OAuth Google..."
                className="clay-pill-input w-full px-3.5 py-2.5 text-xs h-28 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefineModal(false)}
                className="clay-btn-white px-4 py-2 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRefine}
                disabled={refining || !refineInstruction.trim()}
                className="clay-btn-purple px-5 py-2 text-xs font-bold disabled:opacity-50"
              >
                {refining && <FiRefreshCw className="animate-spin" />}
                {refining ? "Memperbarui..." : "Terapkan Perbaikan AI"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor & Viewer Konten */}
      <div className="clay-surface p-7 sm:p-12">
        {editing ? (
          <div key="edit" className="anim-in space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#31224d] mb-1.5">
                Judul Dokumen PRD
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="clay-pill-input w-full px-4 py-3 text-base font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#31224d] mb-1.5">
                Konten Dokumen (Markdown Format)
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="clay-pill-input w-full p-4 font-mono text-xs leading-relaxed"
                style={{ minHeight: "65vh" }}
              />
            </div>
          </div>
        ) : (
          <div key="view" className="anim-in">
            <div className="mb-8 pb-6 border-b border-[#ebdff5] flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#31224d] mb-2 leading-tight">
                  {prd.title}
                </h1>
                <p className="text-xs font-bold text-[#8c74a8]">
                  Dibuat:{" "}
                  {new Date(prd.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {new Date(prd.updatedAt).getTime() !==
                    new Date(prd.createdAt).getTime() && (
                    <>
                      {" "}
                      • Diperbarui:{" "}
                      {new Date(prd.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </>
                  )}
                </p>
              </div>
              {prd.isPublic && (
                <span className="clay-badge bg-[#e8f7ee] text-[#1e824c]">
                  ● Tautan Publik Aktif
                </span>
              )}
            </div>
            <div className="prose max-w-none text-[#3b2d54]">{renderMarkdown(prd.content)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrdDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7657d4]"></div>
        </div>
      }
    >
      <PrdDetailContent />
    </Suspense>
  );
}
