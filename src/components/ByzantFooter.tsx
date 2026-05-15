"use client";

import Link from "next/link";
import ByzantLogo from "@/components/ByzantLogo";

const BG = "#000000";
const INK = "#ffffff";
const FAINT = "#666666";
const SYS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const DISPLAY = "var(--font-inter)";

export default function ByzantFooter() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: "Product",
      items: [
        { label: "Marketplace", href: "/marketplace" },
        { label: "Approvals", href: "/approvals" },
        { label: "Analytics", href: "/analytics" },
        { label: "Agent Log", href: "/log" },
      ],
    },
    {
      title: "Modules",
      items: [
        { label: "Whale Tracker", href: "/marketplace" },
        { label: "Risk Agent", href: "/marketplace" },
        { label: "Congressional Tracker", href: "/marketplace" },
        { label: "Strategy Bots", href: "/marketplace" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Roadmap", href: "/roadmap" },
        { label: "Contact", href: "mailto:hello@byzant.ai" },
      ],
    },
    {
      title: "Connect",
      items: [
        { label: "X (Twitter)", href: "https://x.com" },
        { label: "GitHub", href: "https://github.com" },
        { label: "Documentation", href: "/docs" },
      ],
    },
  ];

  return (
    <>
      <footer
        style={{
          background: BG,
          padding: "80px 80px 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 60,
            }}
          >
            <div>
              <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <ByzantLogo size={22} color="#ffffff" />
            </Link>
              <p
                style={{
                  fontFamily: SYS,
                  fontSize: 13,
                  color: FAINT,
                  margin: "16px 0 0",
                  lineHeight: 1.5,
                }}
              >
                You are the arbiter.
              </p>
            </div>
            {cols.map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 12,
                    fontWeight: 500,
                    color: INK,
                    marginBottom: 16,
                  }}
                >
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.items.map((it) => (
                    <li key={it.label} style={{ marginBottom: 10 }}>
                      <Link
                        href={it.href}
                        style={{
                          fontFamily: SYS,
                          fontSize: 13,
                          color: FAINT,
                          textDecoration: "none",
                        }}
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontFamily: SYS, fontSize: 12, color: FAINT, margin: 0 }}>
              © 2026 Byzant · All rights reserved
            </p>
            <p style={{ fontFamily: SYS, fontSize: 12, color: FAINT, margin: 0 }}>
              <Link href="/privacy" style={{ color: FAINT, textDecoration: "none" }}>
                Privacy Policy
              </Link>
              {" · "}
              <Link href="/terms" style={{ color: FAINT, textDecoration: "none" }}>
                Terms of Service
              </Link>
              {" · "}
              <Link
                href="/docs/integration"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: FAINT, textDecoration: "none" }}
              >
                Integration Guide
              </Link>
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 1024px) {
          footer {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
