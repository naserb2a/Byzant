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

export default function LoginPage() {
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
      title="Log in to Byzant"
      titleSize={32}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#F5F5F5", textDecoration: "none", fontWeight: 500 }}
          >
            Sign up
          </Link>
        </>
      }
    >
      {error && <ErrorPill message={error} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          onClick={() => router.push("/auth/email")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2a2a2a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1f1f1f";
          }}
        >
          Continue with email
        </button>
      </div>
    </AuthShell>
  );
}
