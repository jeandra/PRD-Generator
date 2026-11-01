"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLoader, FiLock, FiMail, FiUser } from "react-icons/fi";
import ClayAuthShell from "@/components/auth/ClayAuthShell";
import ClayField from "@/components/auth/ClayField";
import ClaySocialButtons from "@/components/auth/ClaySocialButtons";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      triggerShake();
      toast.error("Password tidak cocok");
      return;
    }

    if (form.password.length < 8) {
      triggerShake();
      toast.error("Password minimal 8 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerShake();
        toast.error(data.error);
      } else {
        toast.success("Registrasi berhasil! Silakan login.");
        router.push("/login");
      }
    } catch {
      triggerShake();
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClayAuthShell
      compact
      title="Create Account"
      subtitle="Sign up to start generating PRDs"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="clay-link">
            Login
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        className={`clay-form${shake ? " anim-shake" : ""}`}
      >
        <ClayField
          id="name"
          icon={<FiUser />}
          label="Nama Lengkap"
          placeholder="Full Name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <ClayField
          id="email"
          icon={<FiMail />}
          label="Email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <ClayField
          id="password"
          icon={<FiLock />}
          label="Password"
          placeholder="Password"
          autoComplete="new-password"
          toggle
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <ClayField
          id="confirmPassword"
          icon={<FiLock />}
          label="Konfirmasi Password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          toggle
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
        />

        <button type="submit" disabled={loading} className="clay-btn">
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Memproses...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="clay-divider">or continue with</div>
      <ClaySocialButtons action="Daftar" />
    </ClayAuthShell>
  );
}
