"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-2 transition-all duration-300">
      <nav className="clay-nav max-w-6xl mx-auto px-5 sm:px-6 py-2.5">
        <div className="flex justify-between items-center h-11">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9b82] to-[#ff6b57] text-white shadow-[0_4px_12px_rgba(255,107,87,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
              <FaHeart className="text-sm" />
            </span>
            <span className="font-extrabold text-xl tracking-tight text-[#3b2d54]">
              PRD<span className="text-[#ff6b57]">.AI</span>
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-[#543d75] shadow-sm hover:bg-white transition-colors"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    pathname.startsWith("/dashboard")
                      ? "bg-white text-[#5b3b9b] shadow-[0_4px_12px_rgba(74,50,122,0.15),inset_0_2px_4px_rgba(255,255,255,0.9)]"
                      : "text-[#543d75] hover:text-[#2d1f47] hover:bg-white/50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/prd/new"
                  className="clay-btn-coral px-5 py-2 text-sm shadow-sm"
                >
                  + Buat PRD
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-white text-xs font-bold text-[#543d75] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),0_2px_8px_rgba(74,50,122,0.1)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4eaf9] text-[#7657d4]">
                    <FiUser size={12} />
                  </span>
                  <span>{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-[#7a6296] hover:text-red-500 hover:bg-white transition-all shadow-sm"
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="clay-btn-white px-5 py-2 text-sm shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="clay-btn-coral px-5 py-2 text-sm shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#ebdff5] space-y-2 pb-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-xl text-sm font-bold text-[#543d75] hover:bg-white/70"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/prd/new"
                  className="block text-center clay-btn-coral py-2 text-sm w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  + Buat PRD
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-white/70"
                >
                  Logout ({session.user?.name})
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  href="/login"
                  className="clay-btn-white flex-1 py-2 text-sm text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="clay-btn-coral flex-1 py-2 text-sm text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
