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
          maxWidth: 1100,
          margin: 0,
          padding: `${CONTENT_TOP_PAD}px 40px 120px 40px`,
        }}
      >
        <div
          className="docs-shell-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 680px) 200px",
            gap: 80,
            alignItems: "start",
          }}
        >
          <main style={{ maxWidth: 680, minWidth: 0 }}>{children}</main>
          <aside
            className="docs-shell-toc"
            style={{
              width: 200,
              position: "sticky",
              top: CONTENT_TOP_PAD,
              alignSelf: "start",
            }}
          >
            {toc}
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .docs-shell-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 0 !important;
          }
          .docs-shell-toc {
            display: none !important;
          }
          .docs-shell-container {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

export const DOCS_NAV_HEIGHT = NAV_HEIGHT;
export const DOCS_CONTENT_TOP_PAD = CONTENT_TOP_PAD;
