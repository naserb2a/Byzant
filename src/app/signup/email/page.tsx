"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, {
  primaryButton,
  authInput,
  ErrorPill,
} from "@/components/auth/AuthShell";

const SORA = "var(--font-sora)";

export default function SignupEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
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

  if (emailSent) {
    return (
      <AuthShell title="Check your inbox" titleSize={28}>
        <p
          style={{
            fontFamily: SORA,
            fontSize: 14,
            color: "#666666",
            lineHeight: 1.6,
            textAlign: "center",
            margin: 0,
          }}
        >
          We sent a confirmation link to{" "}
          <span style={{ color: "#F5F5F5" }}>{email}</span>. Click it to
          activate your account.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      titleSize={32}
      footer={
        <button
          type="button"
          onClick={() => router.push("/signup")}
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
      }
    >
      {error && <ErrorPill message={error} />}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={authInput}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#99E1D9")}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          style={authInput}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#99E1D9")}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          autoComplete="new-password"
          style={authInput}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#99E1D9")}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        <button
          type="submit"
          disabled={loading}
          style={{ ...primaryButton, opacity: loading ? 0.7 : 1 }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#B2EBE5";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "#99E1D9";
          }}
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
