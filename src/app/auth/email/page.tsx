"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, {
  secondaryButton,
  authInput,
  ErrorPill,
} from "@/components/auth/AuthShell";
import { resolvePostAuthRedirect } from "@/lib/supabase/post-auth";

const SORA = "var(--font-sora)";

export default function AuthEmailPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return;
    setStep("password");
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
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

    const redirect = await resolvePostAuthRedirect(supabase);
    router.push(redirect);
    router.refresh();
  }

  const title =
    step === "email" ? "What's your email address?" : "Enter your password";

  return (
    <AuthShell
      title={title}
      titleSize={28}
      footer={
        step === "email" ? (
          <Link
            href="/auth"
            style={{ color: "#F5F5F5", textDecoration: "none", fontWeight: 500 }}
          >
            Back to login
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setPassword("");
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#F5F5F5",
              fontFamily: SORA,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Back
          </button>
        )
      }
    >
      {error && <ErrorPill message={error} />}

      {step === "email" ? (
        <form
          onSubmit={handleEmailSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            autoComplete="email"
            style={authInput}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#99E1D9")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
          <button
            type="submit"
            style={secondaryButton}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#22223a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a2e")}
          >
            Continue with email
          </button>
        </form>
      ) : (
        <form
          onSubmit={handlePasswordSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="email"
            value={email}
            readOnly
            style={{ ...authInput, opacity: 0.6 }}
            tabIndex={-1}
          />
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
            autoComplete="current-password"
            style={authInput}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#99E1D9")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
          <button
            type="submit"
            disabled={loading}
            style={{ ...secondaryButton, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#22223a";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#1a1a2e";
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
