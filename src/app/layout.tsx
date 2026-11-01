import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-clay",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PRD Generator - Buat PRD Otomatis dengan AI",
  description: "Aplikasi pembuat Product Requirements Document (PRD) otomatis menggunakan AI Gemini",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col clay-app-bg text-[#3b2d54]">
        <Providers>
          <Suspense
            fallback={
              <div className="sticky top-0 z-50 h-16 border-b border-transparent" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
