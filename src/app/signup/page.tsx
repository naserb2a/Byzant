"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell, {
  primaryButton,
  secondaryButton,
  GoogleLogo,
  ErrorPill,
} from "@/components/auth/AuthShell";

const SORA = "var(--font-sora)";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create an edge."
      titleSize={32}
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth"
            style={{ color: "#F5F5F5", textDecoration: "none", fontWeight: 500 }}
          >
            Log in
          </Link>
        </>
      }
    >
      {error && <ErrorPill message={error} />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          maxWidth: 380,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          style={{ ...primaryButton, opacity: loading ? 0.7 : 1 }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#B2EBE5";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "#99E1D9";
          }}
        >
          <GoogleLogo />
          Continue with Google
        </button>

        <button
          type="button"
          style={secondaryButton}
          onClick={() => router.push("/signup/email")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1f1f1f")}
        >
          Continue with email
        </button>
      </div>

      <p
        style={{
          marginTop: 20,
          fontFamily: SORA,
          fontSize: 12,
          color: "#666666",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthShell>
  );
}
