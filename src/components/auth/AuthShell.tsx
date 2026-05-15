"use client";
import Link from "next/link";
import { ReactNode } from "react";

const SORA = "var(--font-sora)";
const INTER = "var(--font-inter)";

export default function AuthShell({
  title,
  titleSize = 32,
  tagline,
  children,
  footer,
}: {
  title: string;
  titleSize?: number;
  tagline?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontFamily: SORA,
            fontSize: 24,
            fontWeight: 600,
            color: "#99E1D9",
            letterSpacing: "-0.01em",
            marginBottom: tagline ? 12 : 32,
          }}
        >
          Byzant
        </Link>

        {tagline && (
          <p
            style={{
              fontFamily: INTER,
              fontSize: 14,
              color: "#666666",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            {tagline}
          </p>
        )}

        <h1
          style={{
            fontFamily: INTER,
            fontSize: titleSize,
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            margin: "0 0 32px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        <div style={{ width: "100%" }}>{children}</div>

        {footer && (
          <div
            style={{
              marginTop: 28,
              fontFamily: INTER,
              fontSize: 13,
              color: "#666666",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export const authButtonBase: React.CSSProperties = {
  width: "100%",
  height: 52,
  borderRadius: 999,
  fontFamily: INTER,
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  transition: "background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease",
};

export const primaryButton: React.CSSProperties = {
  ...authButtonBase,
  background: "#99E1D9",
  color: "#0a0a0a",
  border: "1px solid #99E1D9",
};

export const secondaryButton: React.CSSProperties = {
  ...authButtonBase,
  background: "#1f1f1f",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.08)",
};

export const authInput: React.CSSProperties = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  background: "#101623",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "#F5F5F5",
  fontFamily: INTER,
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.15s ease",
};

export function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
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

export function ErrorPill({ message }: { message: string }) {
  return (
    <div
      style={{
        marginBottom: 14,
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#f87171",
        fontSize: 12,
        fontFamily: INTER,
        textAlign: "left",
      }}
    >
      {message}
    </div>
  );
}
