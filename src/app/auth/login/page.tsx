"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#0a0a0a" }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#99E1D9", fontFamily: "var(--font-playfair)", fontWeight: 700, letterSpacing: 0 }}>Byzant</span>
          </Link>
          <h1
            className="mt-7 mb-1.5 font-bold tracking-tight"
            style={{ fontSize: "22px", color: "#f5f5f5", letterSpacing: "-0.02em" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#888888" }}>
            Sign in to your trading infrastructure
          </p>
        </div>

        {/* Card */}
        <div
          className="p-7"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
          }}
        >
          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-xs"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#888888" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input text-sm px-4 py-2.5"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: "#888888" }}>
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs"
                  style={{ color: "#3B82F6" }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input text-sm px-4 py-2.5"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-orange w-full py-2.5 text-sm mt-2"
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-xs" style={{ color: "#888888" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#3B82F6" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
