"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#0a0a0a" }}
      >
        <div className="text-center max-w-sm">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.5 5.5L21 8M3 8h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2
            className="font-bold mb-2"
            style={{ fontSize: "20px", color: "#f5f5f5", letterSpacing: "-0.02em" }}
          >
            Check your inbox
          </h2>
          <p className="text-sm" style={{ color: "#888888", lineHeight: "1.6" }}>
            We sent a confirmation link to{" "}
            <span style={{ color: "#f5f5f5" }}>{email}</span>. Click it to
            activate your account.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-8 text-sm"
            style={{ color: "#3B82F6" }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
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
          <Link href="/" style={{ textDecoration: "none", fontFamily: "var(--font-geist-mono)", fontWeight: 500 }}>
            <span style={{ color: "#99E1D9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Byzant</span>
          </Link>
          <h1
            className="mt-7 mb-1.5 font-bold tracking-tight"
            style={{ fontSize: "22px", color: "#f5f5f5", letterSpacing: "-0.02em" }}
          >
            Create your account
          </h1>
          <p className="text-sm" style={{ color: "#888888" }}>
            Start building your trading infrastructure today
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

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#888888" }}
              >
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="input text-sm px-4 py-2.5"
              />
            </div>

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
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#888888" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "#444444" }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center mt-5 text-xs" style={{ color: "#888888" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#3B82F6" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
