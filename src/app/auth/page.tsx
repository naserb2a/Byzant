"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthMatrixBackground from "@/components/auth/AuthMatrixBackground";

const SANS = "var(--font-geist-sans)";
const MONO = "var(--font-geist-mono)";

type Mode = "signin" | "signup";

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthContent />
    </Suspense>
  );
}

function AuthFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontFamily: SANS,
        fontSize: 13,
      }}
    >
      Loading…
    </div>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(err);
    const m = searchParams.get("mode");
    if (m === "signup") setMode("signup");
  }, [searchParams]);

  function resetState(next: Mode) {
    setMode(next);
    setError(null);
    setEmailSent(false);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const onboardingComplete = Boolean(user?.user_metadata?.onboarding_complete);

    router.push(onboardingComplete ? "/dashboard" : "/onboarding");
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { onboarding_complete: false },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }

    setEmailSent(true);
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";
  const headline = isSignup ? "Create your account." : "Welcome back.";
  const subtext = isSignup ? "Start using Byzant." : "Sign in to your account.";
  const submitLabel = loading
    ? isSignup ? "Creating…" : "Signing in…"
    : isSignup ? "Create account" : "Sign in";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AuthMatrixBackground />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(153,225,217,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
          background: "#0d1420",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: 40,
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                color: "#99E1D9",
                fontFamily: SANS,
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 0,
                WebkitTextStroke: "0.8px white",
              }}
            >
              Byzant
            </span>
          </Link>
        </div>

        {/* Headline */}
        {emailSent ? (
          <EmailSentState email={email} onBack={() => resetState("signin")} />
        ) : (
          <>
            <h1
              style={{
                fontFamily: SANS,
                fontSize: 22,
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: "0 0 6px",
                textAlign: "left",
              }}
            >
              {headline}
            </h1>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: "#64748b",
                margin: "0 0 24px",
                textAlign: "left",
              }}
            >
              {subtext}
            </p>

            {error && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                  fontSize: 12,
                  fontFamily: SANS,
                }}
              >
                {error}
              </div>
            )}

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "11px 14px",
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                color: "#F5F5F5",
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.background = "#1A1A1A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "#141414";
              }}
            >
              <GoogleLogo />
              Continue with Google
            </button>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "20px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: "#444444",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                or
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Form */}
            <form
              onSubmit={isSignup ? handleSignUp : handleSignIn}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(153,225,217,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />

              <PasswordInput
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggleShow={() => setShowPassword((s) => !s)}
                placeholder="Password"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />

              {isSignup && (
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showPassword}
                  toggleShow={() => setShowPassword((s) => !s)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  hideToggle
                />
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "#99E1D9",
                  border: "1px solid #99E1D9",
                  borderRadius: 6,
                  color: "#0A0A0A",
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  marginTop: 4,
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#B2EBE5";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = "#99E1D9";
                }}
              >
                {submitLabel}
              </button>
            </form>

            {/* Toggle */}
            <p
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 13,
                color: "#64748b",
                fontFamily: SANS,
              }}
            >
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => resetState(isSignup ? "signin" : "signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#99E1D9",
                  fontFamily: SANS,
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6,
  color: "#F5F5F5",
  fontFamily: SANS,
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.15s ease",
};

function PasswordInput({
  value,
  onChange,
  show,
  toggleShow,
  placeholder,
  autoComplete,
  hideToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggleShow: () => void;
  placeholder: string;
  autoComplete: string;
  hideToggle?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{ ...inputStyle, paddingRight: hideToggle ? 14 : 44 }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(153,225,217,0.4)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      />
      {!hideToggle && (
        <button
          type="button"
          onClick={toggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
          }}
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>
  );
}

function EmailSentState({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
          background: "rgba(153,225,217,0.08)",
          border: "1px solid rgba(153,225,217,0.2)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8l7.5 5.5L21 8M3 8h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8Z"
            stroke="#99E1D9"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: SANS,
          fontSize: 20,
          fontWeight: 600,
          color: "#F5F5F5",
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}
      >
        Check your inbox
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.6,
          margin: "0 0 20px",
        }}
      >
        We sent a confirmation link to <span style={{ color: "#F5F5F5" }}>{email}</span>.
        Click it to activate your account.
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#99E1D9",
          fontFamily: SANS,
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
        }}
      >
        ← Back to sign in
      </button>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function Eye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.08A10.94 10.94 0 0112 5c6.5 0 10 7 10 7a17.88 17.88 0 01-3.17 4.19M6.61 6.61A17.88 17.88 0 002 12s3.5 7 10 7a10.94 10.94 0 005.42-1.39"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
