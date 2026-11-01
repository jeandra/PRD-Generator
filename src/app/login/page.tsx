"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLoader, FiLock, FiMail } from "react-icons/fi";
import ClayAuthShell from "@/components/auth/ClayAuthShell";
import ClayField from "@/components/auth/ClayField";
import ClaySocialButtons from "@/components/auth/ClaySocialButtons";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        triggerShake();
        toast.error("Email atau password salah");
      } else {
        toast.success("Login berhasil!");
        router.push("/dashboard");
        router.refresh();
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
      title="Welcome Back"
      subtitle="Login to continue your journey"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="clay-link">
            Sign Up
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        className={`clay-form${shake ? " anim-shake" : ""}`}
      >
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
          autoComplete="current-password"
          toggle
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="clay-forgot-row">
          <button
            type="button"
            className="clay-link"
            onClick={() => toast("Fitur reset password segera hadir")}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" disabled={loading} className="clay-btn">
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Memproses...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="clay-divider">or continue with</div>
      <ClaySocialButtons action="Login" />
    </ClayAuthShell>
  );
}
