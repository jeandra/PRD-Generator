import type { CSSProperties } from "react";
import Link from "next/link";
import {
  FiFileText,
  FiZap,
  FiDownload,
  FiClock,
  FiEdit,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import ClayCharacter from "@/components/auth/ClayCharacter";

const features = [
  {
    icon: FiZap,
    title: "Generate Otomatis",
    description: "Buat PRD lengkap dalam hitungan detik menggunakan AI Gemini berkecepatan tinggi",
    color: "from-[#ff9b82] to-[#ff6b57]",
  },
  {
    icon: FiEdit,
    title: "Edit & AI Refine",
    description: "Edit leluasa atau perbaiki per-section spesifik dengan panduan AI sekali klik",
    color: "from-[#8f74e6] to-[#7657d4]",
  },
  {
    icon: FiDownload,
    title: "Multi-Format Export",
    description: "Download dokumen langsung dalam format Markdown (.md), PDF, dan Word (.docx)",
    color: "from-[#56ccf2] to-[#2f80ed]",
  },
  {
    icon: FiClock,
    title: "Versi & Rollback",
    description: "Setiap perubahan tersimpan otomatis. Kembalikan versi sebelumnya kapan saja",
    color: "from-[#f2994a] to-[#f2c94c]",
  },
  {
    icon: FiFileText,
    title: "Format Vibe Coding",
    description: "Struktur standar industri lengkap dengan Technical Plan dan Implementation Tasks",
    color: "from-[#6fcf97] to-[#27ae60]",
  },
  {
    icon: FiLock,
    title: "Bagikan atau Privat",
    description: "Simpan aman secara privat, atau buat tautan publik read-only untuk tim Anda",
    color: "from-[#bb6bd9] to-[#8e44ad]",
  },
];

const marqueeItems = [
  "Product Requirements Document",
  "AI Gemini Powered",
  "Export Markdown, PDF & DOCX",
  "Riwayat Versi & Rollback",
  "AI Refine per Section",
  "Ready for AI Coding Agents",
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Floating background clouds */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="clay-cloud clay-cloud-a opacity-70" />
          <span className="clay-cloud clay-cloud-b opacity-60" />
          <span className="clay-blob clay-blob-left opacity-50" />
          <span className="clay-blob clay-blob-right opacity-50" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white text-xs font-bold text-[#543d75] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),0_4px_12px_rgba(74,50,122,0.12)] mb-6 anim-in">
            <FaHeart className="text-[#ff6b57]" />
            <span>AI Product Management Assistant</span>
          </div>

          <h1
            className="anim-in text-4xl sm:text-6xl font-extrabold text-[#31224d] mb-6 tracking-tight leading-tight"
            style={delay(40)}
          >
            Buat PRD Profesional
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b57] via-[#e55375] to-[#7657d4]">
              Semudah Berbicara
            </span>
          </h1>

          <p
            className="anim-in text-base sm:text-xl text-[#5b467a] max-w-2xl mx-auto mb-10 font-medium"
            style={delay(120)}
          >
            Susun Product Requirements Document lengkap dengan arsitektur teknis dan daftar task
            dalam hitungan detik. Siap dieksekusi oleh Anda atau AI coding agent.
          </p>

          <div
            className="anim-in flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            style={delay(200)}
          >
            <Link
              href="/prd/new"
              className="clay-btn-coral px-8 py-3.5 text-base sm:text-lg shadow-lg"
            >
              Mulai Buat PRD Sekarang <FiArrowRight />
            </Link>
            <Link
              href="/register"
              className="clay-btn-white px-8 py-3.5 text-base sm:text-lg shadow-md"
            >
              Daftar Akun Gratis
            </Link>
          </div>

          {/* Clay character mascot display */}
          <div className="anim-in flex justify-center" style={delay(280)}>
            <div className="relative p-6 sm:p-8 rounded-[40px] bg-white/70 backdrop-blur-md border border-white shadow-[0_20px_50px_-15px_rgba(74,50,122,0.3),inset_3px_3px_12px_rgba(255,255,255,0.95)] max-w-sm">
              <ClayCharacter className="clay-character mx-auto" />
              <p className="mt-3 text-xs font-bold text-[#6a538a]">
                &ldquo;Tinggal isi ide produkmu, aku yang susun dokumennya!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="relative py-3 px-4 max-w-6xl mx-auto mb-16">
        <div className="clay-nav overflow-hidden py-2.5 px-4">
          <div className="anim-marquee flex w-max text-xs sm:text-sm font-bold tracking-wide text-[#5b437f]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8 pr-8">
                {marqueeItems.map((item) => (
                  <span key={item} className="flex items-center gap-8">
                    <span>{item}</span>
                    <span aria-hidden className="text-[#ff8c70]">
                      ★
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto mb-20">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#31224d] mb-3">
            Fitur Cerdas untuk Tim Produk
          </h2>
          <p className="text-[#5b467a] font-medium max-w-xl mx-auto">
            Semua instrumen yang kamu perlukan dari perancangan konsep hingga kesiapan teknis
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 60} className="h-full">
              <div className="clay-surface-sm p-6 sm:p-7 h-full flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-200">
                <div>
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-[0_6px_16px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.7)] mb-5`}
                  >
                    <feature.icon size={22} />
                  </div>
                  <h3 className="font-bold text-xl text-[#31224d] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#5b467a] text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="py-8 px-4 max-w-4xl mx-auto mb-20">
        <Reveal>
          <div className="clay-surface p-8 sm:p-12 text-center relative overflow-hidden">
            <span className="clay-sparkle clay-sparkle-left top-6 left-6" />
            <span className="clay-sparkle clay-sparkle-right top-6 right-6" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#31224d] mb-4">
              Siap Mewujudkan Ide Produkmu?
            </h2>
            <p className="text-[#5b467a] mb-8 font-medium text-base sm:text-lg max-w-lg mx-auto">
              Hemat puluhan jam penulisan requirements. Coba generator PRD otomatis sekarang secara gratis.
            </p>
            <Link
              href="/register"
              className="clay-btn-coral px-8 py-3.5 text-base sm:text-lg shadow-lg inline-flex"
            >
              Daftar Sekarang — Gratis
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs font-bold text-[#6a538a]">
        <p>&copy; 2026 PRD Generator AI. Crafted with clay & love.</p>
      </footer>
    </div>
  );
}
