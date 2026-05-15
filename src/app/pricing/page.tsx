"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ByzantFooter from "@/components/ByzantFooter";

const DISPLAY = "var(--font-inter)";
const TEAL = "#99E1D9";
const BG = "#000000";
const SURFACE = "#0a0a0a";
const INK = "#ffffff";
const MUTED = "#94a3b8";

type Module = {
  name: string;
  price: number;
  bullets: string[];
};

const MODULES: Module[] = [
  {
    name: "Trailing Stop Bot",
    price: 9,
    bullets: [
      "Auto stop-loss execution",
      "Risk-based position sizing",
      "Real-time price tracking",
    ],
  },
  {
    name: "Risk Agent",
    price: 29,
    bullets: ["Position size limits", "Daily loss caps", "Volatility guardrails"],
  },
  {
    name: "Wheel Strategy Bot",
    price: 29,
    bullets: ["Cash-secured puts", "Covered calls", "Auto-rolling positions"],
  },
  {
    name: "Congressional Tracker",
    price: 29,
    bullets: ["Live filing alerts", "Disclosure monitoring", "Bipartisan view"],
  },
  {
    name: "AI Research Brief",
    price: 19,
    bullets: ["One-click memos", "Thesis + risks", "News + flow context"],
  },
  {
    name: "Real-time Options Flow",
    price: 49,
    bullets: ["Unusual activity feed", "Sweep detection", "Dark pool signals"],
  },
  {
    name: "Whale Tracker",
    price: 29,
    bullets: ["Institutional flow", "Wallet monitoring", "Threshold alerts"],
  },
];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, marginTop: 3 }}
    >
      <path
        d="M3 7.5L5.5 10L11 4.5"
        stroke={TEAL}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModuleCard({ module: m }: { module: Module }) {
  return (
    <div
      className="pricing-card"
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.18s ease",
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 15,
          fontWeight: 600,
          color: INK,
          letterSpacing: "-0.01em",
        }}
      >
        {m.name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 12 }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 24,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          ${m.price}
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: 12, color: MUTED }}>/mo</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          marginTop: 18,
        }}
      >
        {m.bullets.map((b) => (
          <div
            key={b}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              fontFamily: DISPLAY,
              fontSize: 12,
              lineHeight: 1.5,
              color: MUTED,
            }}
          >
            <CheckIcon />
            <span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BundleCard() {
  return (
    <div
      className="pricing-bundle"
      style={{
        background: SURFACE,
        border: "1px solid rgba(153,225,217,0.25)",
        borderRadius: 14,
        padding: "26px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 28,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.16em",
            color: TEAL,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Best Value
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 18,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          Full Platform
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 13,
            color: MUTED,
            lineHeight: 1.55,
            maxWidth: 480,
            marginBottom: 12,
          }}
        >
          All modules included. Best value for active traders.
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 28,
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.02em",
            }}
          >
            $149
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: 13, color: MUTED }}>/mo</span>
        </div>
      </div>

      <Link
        href="/signup"
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: TEAL,
          color: "#000000",
          fontFamily: DISPLAY,
          fontSize: 14,
          fontWeight: 500,
          padding: "10px 20px",
          borderRadius: 999,
          textDecoration: "none",
          letterSpacing: "-0.005em",
          transition: "opacity 0.15s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Get started
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      <main>
        {/* Hero */}
        <section
          className="pricing-hero"
          style={{ padding: "100px 80px 40px" }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(48px, 5.5vw, 76px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: INK,
                margin: 0,
              }}
            >
              Pricing
            </h1>
            <p
              style={{
                fontFamily: DISPLAY,
                fontSize: 15,
                color: MUTED,
                margin: "18px 0 0",
                maxWidth: 560,
                lineHeight: 1.55,
              }}
            >
              Pay only for what you use. No bundles, no bloat.
            </p>
          </div>
        </section>

        {/* Module grid */}
        <section
          className="pricing-section"
          style={{ padding: "24px 80px 0" }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              className="pricing-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {MODULES.map((m) => (
                <ModuleCard key={m.name} module={m} />
              ))}
            </div>
          </div>
        </section>

        {/* Full Platform Bundle */}
        <section
          className="pricing-section"
          style={{ padding: "20px 80px 0" }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <BundleCard />
          </div>
        </section>

        <div style={{ height: 120 }} />
      </main>

      <ByzantFooter />

      <style jsx global>{`
        .pricing-card:hover {
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        @media (max-width: 1024px) {
          .pricing-hero {
            padding: 80px 32px 32px !important;
          }
          .pricing-section {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
          .pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .pricing-bundle {
            padding: 24px !important;
          }
        }

        @media (max-width: 700px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-bundle {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
