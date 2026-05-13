"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ByzantLogo from "@/components/ByzantLogo";

const INTER = "var(--font-inter)";
const BG = "#000000";
const INK = "#ffffff";

const NAV_HEIGHT = 64;
const CONTENT_TOP_PAD = 88;

export default function DocsShell({
  toc,
  children,
}: {
  toc?: React.ReactNode;
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

      <div
        className="docs-shell-container"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: `${CONTENT_TOP_PAD}px 24px 120px 24px`,
        }}
      >
        {children}
      </div>

      {toc}

      <style jsx global>{`
        @media (max-width: 960px) {
          .docs-shell-container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

export const DOCS_NAV_HEIGHT = NAV_HEIGHT;
export const DOCS_CONTENT_TOP_PAD = CONTENT_TOP_PAD;
