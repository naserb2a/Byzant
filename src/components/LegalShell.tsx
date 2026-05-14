"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ByzantLogo from "@/components/ByzantLogo";

export const BG = "#000000";
export const INK = "#ffffff";
export const MUTED = "#94a3b8";
export const TEAL = "#99E1D9";
export const BORDER = "rgba(255,255,255,0.06)";
export const INTER = "var(--font-inter)";

const NAV_HEIGHT = 64;
const CONTENT_TOP_PAD = 88;

export default function LegalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: BG,
        color: INK,
        minHeight: "100vh",
        fontFamily: INTER,
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "20px 40px",
          height: NAV_HEIGHT,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${
            scrolled ? "rgba(255,255,255,0.08)" : "transparent"
          }`,
          transition:
            "background 150ms ease, border-color 150ms ease, backdrop-filter 150ms ease, -webkit-backdrop-filter 150ms ease",
        }}
      >
        <Link
          href="/"
          aria-label="Byzant home"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <ByzantLogo size={22} color={INK} />
        </Link>
      </header>
      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: `${CONTENT_TOP_PAD}px 24px 120px`,
        }}
      >
        {children}
      </main>
    </div>
  );
}

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: INTER,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: TEAL,
  margin: "48px 0 12px",
};

const paragraphStyle: React.CSSProperties = {
  fontFamily: INTER,
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.7,
  color: INK,
  margin: "0 0 14px",
};

const listStyle: React.CSSProperties = {
  fontFamily: INTER,
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.7,
  color: MUTED,
  paddingLeft: 20,
  margin: "0 0 14px",
};

const reviewPillStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: INTER,
  fontSize: 11,
  fontWeight: 600,
  color: "var(--db-amber)",
  background: "var(--db-amber-dim)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "2px 8px",
  borderRadius: 999,
  marginLeft: 8,
  verticalAlign: "middle",
};

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: INTER,
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: INK,
        margin: 0,
        lineHeight: 1.15,
      }}
    >
      {children}
    </h1>
  );
}

export function LastUpdated({ date }: { date: string }) {
  return (
    <p
      style={{
        fontFamily: INTER,
        fontSize: 13,
        fontWeight: 400,
        color: MUTED,
        margin: "8px 0 0",
      }}
    >
      Last updated: {date}
    </p>
  );
}

export function Section({
  number,
  title,
  needsReview = false,
  children,
}: {
  number: number;
  title: string;
  needsReview?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 style={sectionHeadingStyle}>
        {number}. {title}
        {needsReview && (
          <span style={reviewPillStyle}>[Requires lawyer review]</span>
        )}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={paragraphStyle}>{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul style={listStyle}>{children}</ul>;
}

export function ReviewPill() {
  return <span style={reviewPillStyle}>[Requires lawyer review]</span>;
}

export function MailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      style={{
        fontFamily: INTER,
        color: TEAL,
        textDecoration: "none",
      }}
    >
      {email}
    </a>
  );
}
