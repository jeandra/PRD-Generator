"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiArrowRight, FiLoader } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

const steps = [
  { title: "Info Produk", description: "Nama dan deskripsi produk" },
  { title: "Target & Masalah", description: "Target user dan masalah" },
  { title: "Fitur Utama", description: "Fitur produk utama" },
  { title: "Template & Detail", description: "Gaya PRD, timeline, metrics" },
];

const generatingMessages = [
  "Menganalisis kebutuhan produk...",
  "Menyusun struktur PRD profesional...",
  "Merumuskan technical plan & data model...",
  "Menyusun task list siap vibe-coding...",
  "Merapikan format dokumen...",
];

export default function NewPrdPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetUser: "",
    problem: "",
    features: "",
    timeline: "",
    constraints: "",
    metrics: "",
    template: "Standar",
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!generating) return;

    const timer = setInterval(() => {
      setStatusIndex((index) => (index + 1) % generatingMessages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [generating]);

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const fillDemo = () => {
    setForm({
      title: "RuangKelas",
      description: "Platform belajar kelompok untuk mahasiswa dengan jadwal, ruang diskusi, dan ringkasan AI.",
      targetUser: "Mahasiswa semester awal yang kesulitan menemukan teman belajar dan menjaga konsistensi belajar.",
      problem: "Belajar mandiri sering tidak konsisten, materi tercecer, dan sulit mengukur progres bersama.",
      features: "- Buat ruang belajar berdasarkan mata kuliah\n- Jadwal dan pengingat sesi\n- Chat dan berbagi catatan\n- Ringkasan materi dengan AI\n- Progress dan streak belajar",
      timeline: "MVP dalam 8 minggu",
      constraints: "Tim 3 developer, mobile-first, gunakan layanan cloud managed",
      metrics: "40% pengguna menyelesaikan 3 sesi belajar per minggu; retention minggu ke-4 > 25%",
      template: "Startup",
    });
    setCurrentStep(0);
    trackEvent("demo_loaded");
    toast.success("Contoh PRD dimuat — silakan ubah sesuai ide Anda");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return form.title.trim() && form.description.trim();
      case 1:
        return form.targetUser.trim() && form.problem.trim();
      case 2:
        return form.features.trim();
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      triggerShake();
      if (currentStep === 0 && (!form.title.trim() || !form.description.trim())) {
        toast.error("Mohon isi Nama dan Deskripsi Produk");
      } else if (currentStep === 1 && (!form.targetUser.trim() || !form.problem.trim())) {
        toast.error("Mohon lengkapi Target User dan Masalah");
      } else if (currentStep === 2 && !form.features.trim()) {
        toast.error("Mohon sebutkan minimal satu fitur utama");
      }
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    if (!canProceed()) {
      triggerShake();
      toast.error("Mohon lengkapi data yang diperlukan");
      return;
    }
    setGenerating(true);
    setStatusIndex(0);
    trackEvent("generate_started", { template: form.template });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Gagal generate PRD");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        toast.error("Gagal membaca streaming PRD");
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";
      let prd: { id: string } | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const line = event.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const payload = JSON.parse(line.slice(5).trim()) as {
            type?: string;
            prd?: { id: string };
          };
          if (payload.type === "done" && payload.prd) {
            prd = payload.prd;
            break;
          }
        }
      }
      decoder.decode();

      if (!prd) {
        toast.error("Gagal generate PRD");
        return;
      }

      trackEvent("generate_completed", { template: form.template });
      toast.success("PRD berhasil di-generate!");
      router.push(`/prd/${prd.id}`);
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7657d4]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white text-xs font-bold text-[#543d75] shadow-sm mb-3">
          <FaHeart className="text-[#ff6b57] text-xs" />
          <span>Wizard Pembuatan Dokumen</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#31224d]">Buat PRD Baru</h1>
        <p className="text-[#5b467a] text-sm font-medium mt-1">
          Lengkapi langkah sederhana di bawah, AI akan merancang PRD lengkap untukmu
        </p>
        <button
          type="button"
          onClick={fillDemo}
          className="clay-btn-white px-4 py-2 text-xs font-bold mt-4"
        >
          Isi dengan Contoh Demo
        </button>
      </div>

      {/* Progress Track */}
      <div className="mb-8 h-2.5 w-full overflow-hidden rounded-full bg-white/60 p-0.5 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff8c70] via-[#e55375] to-[#7657d4] transition-[width] duration-500 ease-out shadow-sm"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Steps Indicator Balls */}
      <div className="flex items-center mb-8 px-2">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-gradient-to-br from-[#ff9b82] to-[#ff6b57] text-white shadow-[0_4px_12px_rgba(255,107,87,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] scale-105"
                    : "bg-white/80 text-[#8c74a8] shadow-inner"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-[11px] font-bold mt-2 text-[#5b467a] hidden sm:block">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full transition-colors duration-300 ${
                  index < currentStep ? "bg-[#ff8c70]" : "bg-white/60"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Wizard Card */}
      <div className={`clay-surface p-6 sm:p-10 transition-all ${shake ? "anim-shake" : ""}`}>
        <div key={currentStep} className="anim-step">
          {/* Step 0: Info Produk */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm"
                  placeholder="Contoh: GoFood, Catatanku, Slack"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Deskripsi Singkat Produk <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm h-32 resize-none"
                  placeholder="Jelaskan secara ringkas tentang visi dan kegunaan produk..."
                />
              </div>
            </div>
          )}

          {/* Step 1: Target & Masalah */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Target Pengguna (User Persona) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.targetUser}
                  onChange={(e) => updateField("targetUser", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm h-28 resize-none"
                  placeholder="Siapa target pengguna produk ini? (contoh: mahasiswa usia 18-25 tahun, pekerja remote, UMKM)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Masalah Utama yang Diselesaikan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.problem}
                  onChange={(e) => updateField("problem", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm h-28 resize-none"
                  placeholder="Masalah atau pain point apa yang ingin diatasi?"
                />
              </div>
            </div>
          )}

          {/* Step 2: Fitur Utama */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Fitur-Fitur Utama <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.features}
                  onChange={(e) => updateField("features", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm h-48 resize-none font-mono"
                  placeholder="Sebutkan fitur-fitur penting (satu per baris):&#10;- Otentikasi pengguna & peran&#10;- Dashboard analitik penjualan&#10;- Integrasi payment gateway"
                />
              </div>
            </div>
          )}

          {/* Step 3: Template & Detail Tambahan */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Gaya & Template PRD
                </label>
                <select
                  value={form.template}
                  onChange={(e) => updateField("template", e.target.value)}
                  className="clay-pill-input w-full px-4 py-3 text-sm font-bold cursor-pointer"
                >
                  <option value="Standar">Standar — lintas fungsi & seimbang</option>
                  <option value="Startup">Startup — MVP & eksperimen cepat</option>
                  <option value="Enterprise">Enterprise — governance & compliance</option>
                  <option value="Mobile">Mobile — iOS/Android & lifecycle</option>
                  <option value="SaaS">SaaS — multi-tenant & subscription</option>
                  <option value="Marketplace">Marketplace — supply, demand & trust</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Target Timeline (Opsional)
                </label>
                <textarea
                  value={form.timeline}
                  onChange={(e) => updateField("timeline", e.target.value)}
                  className="clay-pill-input w-full px-4 py-2.5 text-sm h-20 resize-none"
                  placeholder="Contoh: Rilis MVP dalam 2 bulan, beta testing Q3 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Batasan / Constraints (Opsional)
                </label>
                <textarea
                  value={form.constraints}
                  onChange={(e) => updateField("constraints", e.target.value)}
                  className="clay-pill-input w-full px-4 py-2.5 text-sm h-20 resize-none"
                  placeholder="Contoh: Harus mobile-first, tech stack Next.js + MySQL"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#31224d] mb-1.5">
                  Success Metrics (Opsional)
                </label>
                <textarea
                  value={form.metrics}
                  onChange={(e) => updateField("metrics", e.target.value)}
                  className="clay-pill-input w-full px-4 py-2.5 text-sm h-20 resize-none"
                  placeholder="Contoh: 1.000 user aktif bulan pertama, 99.9% uptime"
                />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#f0e3f5]">
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="clay-btn-white px-5 py-2.5 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiArrowLeft /> Sebelumnya
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className={`clay-btn-purple px-6 py-2.5 text-xs font-bold ${!canProceed() ? "opacity-75" : ""}`}
            >
              Selanjutnya <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="clay-btn-coral px-8 py-2.5 text-xs font-bold shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <FiLoader className="animate-spin" /> Menulis PRD...
                </>
              ) : (
                "✨ Generate PRD Sekarang"
              )}
            </button>
          )}
        </div>

        {/* Streaming Animation status */}
        {generating && (
          <div className="anim-fade mt-6 flex items-center justify-center gap-3 rounded-2xl bg-white/90 p-4 text-xs font-bold text-[#5b3b9b] border border-white shadow-inner">
            <span className="dot-loading flex items-center">
              <span className="bg-[#ff6b57]" />
              <span className="bg-[#ff6b57]" />
              <span className="bg-[#ff6b57]" />
            </span>
            <span key={statusIndex} className="anim-fade">
              {generatingMessages[statusIndex]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
