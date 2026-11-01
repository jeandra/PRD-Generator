"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  PRD_GENERATING_MESSAGES,
  PRD_WIZARD_STEPS,
} from "@/constants/prd";
import { trackEvent } from "@/lib/analytics";
import type { PrdWizardForm } from "@/types/prd";

const INITIAL_FORM: PrdWizardForm = {
  title: "",
  description: "",
  targetUser: "",
  problem: "",
  features: "",
  timeline: "",
  constraints: "",
  metrics: "",
  template: "Standar",
};

const DEMO_FORM: PrdWizardForm = {
  title: "RuangKelas",
  description:
    "Platform belajar kelompok untuk mahasiswa dengan jadwal, ruang diskusi, dan ringkasan AI.",
  targetUser:
    "Mahasiswa semester awal yang kesulitan menemukan teman belajar dan menjaga konsistensi belajar.",
  problem:
    "Belajar mandiri sering tidak konsisten, materi tercecer, dan sulit mengukur progres bersama.",
  features:
    "- Buat ruang belajar berdasarkan mata kuliah\n- Jadwal dan pengingat sesi\n- Chat dan berbagi catatan\n- Ringkasan materi dengan AI\n- Progress dan streak belajar",
  timeline: "MVP dalam 8 minggu",
  constraints:
    "Tim 3 developer, mobile-first, gunakan layanan cloud managed",
  metrics:
    "40% pengguna menyelesaikan 3 sesi belajar per minggu; retention minggu ke-4 > 25%",
  template: "Startup",
};

export function usePrdWizard() {
  const router = useRouter();
  const [form, setForm] = useState<PrdWizardForm>(INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!generating) return;

    const timer = setInterval(() => {
      setStatusIndex((index) => (index + 1) % PRD_GENERATING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [generating]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const updateField = <K extends keyof PrdWizardForm>(
    field: K,
    value: PrdWizardForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (() => {
    switch (currentStep) {
      case 0:
        return Boolean(form.title.trim() && form.description.trim());
      case 1:
        return Boolean(form.targetUser.trim() && form.problem.trim());
      case 2:
        return Boolean(form.features.trim());
      case 3:
        return true;
      default:
        return false;
    }
  })();

  const next = () => {
    if (!canProceed) {
      triggerShake();
      if (currentStep === 0) {
        toast.error("Mohon isi Nama dan Deskripsi Produk");
      } else if (currentStep === 1) {
        toast.error("Mohon lengkapi Target User dan Masalah");
      } else if (currentStep === 2) {
        toast.error("Mohon sebutkan minimal satu fitur utama");
      }
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, PRD_WIZARD_STEPS.length - 1));
  };

  const previous = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const fillDemo = () => {
    setForm(DEMO_FORM);
    setCurrentStep(0);
    trackEvent("demo_loaded");
    toast.success("Contoh PRD dimuat — silakan ubah sesuai ide Anda");
  };

  const generate = async () => {
    if (!canProceed) {
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
      let prdId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data:"));
          if (!line) continue;

          const payload = JSON.parse(line.slice(5).trim()) as {
            type?: string;
            prd?: { id: string };
          };

          if (payload.type === "done" && payload.prd) {
            prdId = payload.prd.id;
            break;
          }
        }
      }

      if (!prdId) {
        toast.error("Gagal generate PRD");
        return;
      }

      trackEvent("generate_completed", { template: form.template });
      toast.success("PRD berhasil di-generate!");
      router.push(`/prd/${prdId}`);
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  return {
    form,
    currentStep,
    generating,
    statusIndex,
    shake,
    canProceed,
    updateField,
    next,
    previous,
    fillDemo,
    generate,
  };
}
