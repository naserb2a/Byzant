"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ByzantLogo from "@/components/ByzantLogo";
import ByzantInteractiveDemo from "@/components/ByzantInteractiveDemo";

/* ─── Tokens ───────────────────────────────────────────────────── */
const DISPLAY = "var(--font-inter)";
const SYS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const TEAL = "#99E1D9";
const BG = "#000000";
const SURFACE = "#0a0a0a";
const SURFACE_2 = "#111111";
const INK = "#ffffff";
const MUTED = "#94a3b8";
const FAINT = "#666666";

/* ─── Reveal wrapper (scroll fade-in) ─────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Pill buttons ─────────────────────────────────────────────── */
function TealPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: TEAL,
        color: "#000000",
        fontFamily: DISPLAY,
        fontSize: 14,
        fontWeight: 500,
        padding: "10px 18px",
        borderRadius: 999,
        textDecoration: "none",
        letterSpacing: "-0.005em",
        transition: "transform 0.15s ease, opacity 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </Link>
  );
}

function GhostPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "transparent",
        color: "#ffffff",
        fontFamily: DISPLAY,
        fontSize: 14,
        fontWeight: 500,
        padding: "10px 18px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.18)",
        textDecoration: "none",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </Link>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="nav-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 80px",
          height: 64,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <ByzantLogo size={22} color="#ffffff" />
        </Link>

        <nav
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: 32 }}
        >
          <Link
            href="#features"
            style={{
              fontFamily: DISPLAY,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
            }}
          >
            Marketplace
          </Link>
          <Link
            href="#how-it-works"
            style={{
              fontFamily: DISPLAY,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
            }}
          >
            How it Works
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/auth/login"
            className="nav-signin"
            style={{
              fontFamily: DISPLAY,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
          <TealPill href="/signup">Join Waitlist</TealPill>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function HeroHeadline() {
  const words = ["Trading", "infrastructure", "for", "the", "age", "of", "agents."];
  return (
    <h1
      style={{
        fontFamily: DISPLAY,
        fontSize: "clamp(38px, 5vw, 68px)",
        fontWeight: 600,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
        color: INK,
        margin: 0,
        maxWidth: 980,
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}

function Hero() {
  return (
    <section
      style={{
        background: BG,
        padding: "80px 80px 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <HeroHeadline />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            fontFamily: SYS,
            fontSize: "clamp(16px, 1.4vw, 19px)",
            color: FAINT,
            margin: "32px 0 40px",
            maxWidth: 540,
            lineHeight: 1.55,
          }}
        >
          Your agent analyzes. You decide. Every time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          style={{ marginBottom: 80 }}
        >
          <TealPill href="/signup">Join Waitlist</TealPill>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ByzantInteractiveDemo />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Trust logos ─────────────────────────────────────────────── */
function OpenAIIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}
function GeminiIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 0c0 6.627 5.373 12 12 12-6.627 0-12 5.373-12 12 0-6.627-5.373-12-12-12 6.627 0 12-5.373 12-12z" />
    </svg>
  );
}

function TrustItem({
  name,
  iconSrc,
  Icon,
  hideName = false,
}: {
  name: string;
  iconSrc?: string;
  Icon?: React.ComponentType;
  hideName?: boolean;
}) {
  const tint = "rgba(255,255,255,0.7)";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: tint,
        opacity: 0.85,
      }}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={hideName ? name : ""}
          style={{
            height: 22,
            width: "auto",
            filter: "brightness(0) invert(1)",
            opacity: 0.85,
          }}
        />
      ) : Icon ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 22,
            filter: "brightness(0) invert(1)",
            opacity: 0.85,
          }}
        >
          <Icon />
        </span>
      ) : null}
      {!hideName && (
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 15,
            fontWeight: 500,
            color: tint,
            letterSpacing: "-0.005em",
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

function TrustLogos() {
  return (
    <section style={{ background: BG, padding: "60px 80px 100px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: FAINT,
              margin: "0 0 28px",
              textAlign: "center",
            }}
          >
            Works with your agent
          </p>
          <div
            className="trust-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <TrustItem name="OpenClaw" iconSrc="/icons/openclaw.svg" />
            <TrustItem name="Claude" iconSrc="/icons/claude-wordmark.svg" hideName />
            <TrustItem name="GPT 5.5" Icon={OpenAIIcon} />
            <TrustItem name="Gemini" Icon={GeminiIcon} />
            <TrustItem name="Grok" iconSrc="/icons/grok-wordmark-dark.svg" hideName />
            <TrustItem name="LangChain" iconSrc="/icons/langchain.svg" hideName />
            <TrustItem name="Cursor" iconSrc="/icons/cursor_dark.svg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Generic feature header (Linear two-col) ─────────────────── */
function FeatureHeader({
  headline,
  body,
  invert = false,
}: {
  headline: string;
  body: string;
  invert?: boolean;
}) {
  return (
    <div
      className="feature-header"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
        gap: 80,
        alignItems: "start",
        marginBottom: 80,
      }}
    >
      <Reveal>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: invert ? "#000000" : INK,
            margin: 0,
          }}
        >
          {headline}
        </h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p
          style={{
            fontFamily: SYS,
            fontSize: 16,
            lineHeight: 1.6,
            color: invert ? "#444444" : MUTED,
            margin: 0,
            maxWidth: 540,
          }}
        >
          {body}
        </p>
      </Reveal>
    </div>
  );
}

function ReferenceLabel({ children, invert = false }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 60,
      }}
    >
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: 11,
          letterSpacing: "0.08em",
          color: invert ? "#666666" : FAINT,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ─── Feature 1 — Modules ─────────────────────────────────────── */
function FeatureOne() {
  const modules = [
    {
      name: "Whale Tracker",
      cat: "Intelligence",
      price: "$29 / mo",
      desc: "Real-time options flow and dark pool activity.",
    },
    {
      name: "Risk Agent",
      cat: "Protection",
      price: "$29 / mo",
      desc: "Position-size guardrails and stop enforcement.",
    },
    {
      name: "Congressional Tracker",
      cat: "Intelligence",
      price: "$29 / mo",
      desc: "Live disclosures from US lawmakers, parsed.",
    },
  ];
  return (
    <section id="features" style={{ background: BG, padding: "120px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FeatureHeader
          headline="Institutional edge. Zero setup."
          body="Byzant modules connect to your agent via MCP — the protocol agents already speak. Whale tracking, congressional flow, risk enforcement, strategy bots. Activate in one click. No terminals. No configuration."
        />

        <div
          className="feature-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}
        >
          {modules.map((m, i) => (
            <Reveal key={m.name} delay={0.05 * i}>
              <div
                className="float-card"
                style={{
                  background: SURFACE,
                  border: "1px solid rgba(153,225,217,0.18)",
                  borderRadius: 12,
                  padding: 24,
                  position: "relative",
                  overflow: "hidden",
                  animation: `float 5s ease-in-out ${i * 0.6}s infinite`,
                }}
              >
                <div
                  className="pulse-border"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    pointerEvents: "none",
                    boxShadow: "0 0 0 1px rgba(153,225,217,0.0) inset",
                    animation: `pulse 3s ease-in-out ${i * 0.4}s infinite`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: TEAL,
                      background: "rgba(153,225,217,0.1)",
                      border: "1px solid rgba(153,225,217,0.2)",
                      padding: "3px 8px",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    {m.cat}
                  </span>
                  <span style={{ fontFamily: DISPLAY, fontSize: 12, color: MUTED }}>{m.price}</span>
                </div>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 20,
                    fontWeight: 600,
                    color: INK,
                    margin: "0 0 8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {m.name}
                </h3>
                <p
                  style={{
                    fontFamily: SYS,
                    fontSize: 14,
                    color: MUTED,
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  {m.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <ReferenceLabel>01 · Marketplace →</ReferenceLabel>
      </div>
    </section>
  );
}

/* ─── Feature 2 — Approval (typing animation) ─────────────────── */
function ApprovalCard() {
  const fullText =
    "Agent requests to open a long position in NVDA. 50 shares · Est. $5,920";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [typed, setTyped] = useState("");
  const [approved, setApproved] = useState(false);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 28,
        maxWidth: 640,
        margin: "0 auto",
        boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(153,225,217,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(153,225,217,0.12)",
              border: "1px solid rgba(153,225,217,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 12,
              color: TEAL,
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: INK }}>
              Alpha-1
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, color: FAINT, marginTop: 1 }}>
              NVDA · $118.40
            </div>
          </div>
        </div>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: TEAL,
          }}
        >
          Awaiting your approval
        </span>
      </div>

      <div
        style={{
          background: "rgba(153,225,217,0.04)",
          border: "1px solid rgba(153,225,217,0.15)",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 18,
          minHeight: 64,
        }}
      >
        <p
          style={{
            fontFamily: SYS,
            fontSize: 14,
            color: INK,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {typed}
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              background: TEAL,
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }}
          />
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {[
          ["ENTRY", "$118.40"],
          ["STOP LOSS", "$113.20"],
          ["R/R", "1:3.2"],
          ["CONFIDENCE", "82%"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              background: SURFACE_2,
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 9,
                letterSpacing: "0.1em",
                color: FAINT,
                marginBottom: 4,
              }}
            >
              {k}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: INK }}>
              {v}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={approved}
          onClick={() => setApproved(true)}
          onMouseDown={() => !approved && setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          style={{
            flex: 1,
            background: approved ? "#4ade80" : TEAL,
            color: "#000000",
            border: "none",
            borderRadius: 10,
            padding: "11px 0",
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 600,
            cursor: approved ? "default" : "pointer",
            transform: pressing && !approved ? "scale(0.97)" : "scale(1)",
            transition: "background 0.25s ease, transform 0.12s ease",
          }}
        >
          {approved ? "Approved ✓" : "Approve"}
        </button>
        <button
          style={{
            flex: 1,
            background: SURFACE_2,
            color: MUTED,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "11px 0",
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function FeatureTwo() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #000000 35%, #1a1a1a 75%, #2a2a2a 100%)",
        padding: "120px 80px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FeatureHeader
          headline="The agent works. You decide."
          body="Every trade, every module activation, every agent action surfaces as an approval. You review the signal, the reasoning, the risk. Then you approve or decline. The agent never acts without your explicit sign-off. You are always the arbiter."
        />

        <Reveal>
          <ApprovalCard />
        </Reveal>

        <ReferenceLabel>02 · Approvals →</ReferenceLabel>
      </div>
    </section>
  );
}

/* ─── Feature 3 — Whale Tracker JSON ──────────────────────────── */
function WhaleJSON() {
  const records = [
    {
      ticker: "NVDA",
      type: "call",
      strike: 125,
      expiration: "2026-07-17",
      volume: 18204,
      openInterest: 412,
      volumeOIRatio: 44.18,
      impliedVolatility: 0.4118,
      premium: 1842500,
      underlyingPrice: 118.4,
      tradeTime: "2026-05-04T14:32:18Z",
      sentiment: "bullish",
    },
    {
      ticker: "PLTR",
      type: "call",
      strike: 92,
      expiration: "2026-06-19",
      volume: 8421,
      openInterest: 312,
      volumeOIRatio: 27.0,
      impliedVolatility: 0.6712,
      premium: 612300,
      underlyingPrice: 88.12,
      tradeTime: "2026-05-04T14:18:02Z",
      sentiment: "bullish",
    },
    {
      ticker: "TSLA",
      type: "put",
      strike: 220,
      expiration: "2026-06-19",
      volume: 11540,
      openInterest: 902,
      volumeOIRatio: 12.79,
      impliedVolatility: 0.5402,
      premium: 988140,
      underlyingPrice: 232.55,
      tradeTime: "2026-05-04T14:05:41Z",
      sentiment: "bearish",
    },
    {
      ticker: "GMAB",
      type: "call",
      strike: 30,
      expiration: "2026-08-21",
      volume: 15332,
      openInterest: 145,
      volumeOIRatio: 105.74,
      impliedVolatility: 0.5341,
      premium: 224800,
      underlyingPrice: 28.4,
      tradeTime: "2026-05-04T13:58:09Z",
      sentiment: "bullish",
    },
    {
      ticker: "AAPL",
      type: "put",
      strike: 175,
      expiration: "2026-07-17",
      volume: 9820,
      openInterest: 1244,
      volumeOIRatio: 7.89,
      impliedVolatility: 0.2991,
      premium: 412600,
      underlyingPrice: 184.22,
      tradeTime: "2026-05-04T13:42:30Z",
      sentiment: "bearish",
    },
    {
      ticker: "AMD",
      type: "call",
      strike: 160,
      expiration: "2026-09-18",
      volume: 7115,
      openInterest: 288,
      volumeOIRatio: 24.7,
      impliedVolatility: 0.5208,
      premium: 502100,
      underlyingPrice: 142.88,
      tradeTime: "2026-05-04T13:21:54Z",
      sentiment: "bullish",
    },
    {
      ticker: "META",
      type: "put",
      strike: 480,
      expiration: "2026-06-19",
      volume: 6290,
      openInterest: 410,
      volumeOIRatio: 15.34,
      impliedVolatility: 0.3782,
      premium: 1304800,
      underlyingPrice: 502.18,
      tradeTime: "2026-05-04T13:08:11Z",
      sentiment: "bearish",
    },
    {
      ticker: "COIN",
      type: "call",
      strike: 285,
      expiration: "2026-08-21",
      volume: 5481,
      openInterest: 162,
      volumeOIRatio: 33.83,
      impliedVolatility: 0.7912,
      premium: 738400,
      underlyingPrice: 248.6,
      tradeTime: "2026-05-04T12:55:47Z",
      sentiment: "bullish",
    },
  ];

  const renderRecord = (r: typeof records[0], i: number) => {
    const lines: [string, string | number, string][] = [
      ["ticker", `"${r.ticker}"`, "string"],
      ["type", `"${r.type}"`, "string"],
      ["strike", r.strike, "number"],
      ["expiration", `"${r.expiration}"`, "string"],
      ["volume", r.volume, "number"],
      ["openInterest", r.openInterest, "number"],
      ["volumeOIRatio", r.volumeOIRatio, "number"],
      ["impliedVolatility", r.impliedVolatility, "number"],
      ["premium", r.premium, "number"],
      ["underlyingPrice", r.underlyingPrice, "number"],
      ["tradeTime", `"${r.tradeTime}"`, "string"],
      ["sentiment", `"${r.sentiment}"`, "string"],
    ];
    return (
      <div key={i} style={{ marginBottom: i < records.length - 1 ? 14 : 0 }}>
        <div style={{ color: "#888888" }}>{"{"}</div>
        {lines.map(([k, v, type]) => (
          <div key={k} style={{ paddingLeft: 20 }}>
            <span style={{ color: "#7dd3c0" }}>&quot;{k}&quot;</span>
            <span style={{ color: "#666666" }}>: </span>
            <span style={{ color: type === "string" ? "#e6c07b" : "#c5d4e8" }}>{v}</span>
            <span style={{ color: "#666666" }}>,</span>
          </div>
        ))}
        <div style={{ color: "#888888" }}>{i < records.length - 1 ? "}," : "}"}</div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 14,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "#080808",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: TEAL,
              boxShadow: "0 0 12px rgba(153,225,217,0.6)",
              animation: "pulse-dot 1.4s ease-in-out infinite",
            }}
          />
          <span style={{ fontFamily: DISPLAY, fontSize: 12, color: MUTED }}>
            Live · Updating every 60 minutes during market hours
          </span>
        </div>
        <span style={{ fontFamily: DISPLAY, fontSize: 11, color: FAINT, letterSpacing: "0.04em" }}>
          whale_tracker.json
        </span>
      </div>

      <div
        className="whale-scroll"
        style={{
          padding: "24px 28px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          fontSize: 13,
          lineHeight: 1.7,
          color: INK,
          height: 420,
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ color: "#888888" }}>[</div>
          <div style={{ paddingLeft: 16 }}>{records.map(renderRecord)}</div>
          <div style={{ color: "#888888" }}>]</div>

          {/* Scanline */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background:
                "linear-gradient(180deg, rgba(153,225,217,0) 0%, rgba(153,225,217,0.18) 50%, rgba(153,225,217,0) 100%)",
              pointerEvents: "none",
              animation: "scanline 22s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureThree() {
  return (
    <section style={{ background: "#ffffff", padding: "120px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FeatureHeader
          headline="See what institutional money sees."
          body="The Whale Tracker module monitors unusual options flow and dark pool activity in real time. 1,000+ signals scraped every 60 minutes during market hours. Your agent surfaces the ones that matter."
          invert
        />
        <Reveal>
          <WhaleJSON />
        </Reveal>
        <ReferenceLabel invert>03 · Whale Tracker →</ReferenceLabel>
      </div>
    </section>
  );
}

/* ─── Feature 4 — Sticky-scroll signal-to-execution ─────────────── */
const STEPS = [
  {
    cat: "01 · MCP Protocol",
    head: "Agent · Byzant linked",
    body: "Your agent speaks Byzant natively via MCP. Zero configuration, millisecond handshake.",
  },
  {
    cat: "02 · Signal",
    head: "NVDA · Bullish +0.82",
    body: "Sentiment, flow, and pattern inputs aggregate into a single conviction score.",
  },
  {
    cat: "03 · Approval",
    head: "Awaiting your decision",
    body: "Every trade surfaces a concise brief. Size, risk, horizon. You hold the final click.",
  },
  {
    cat: "04 · Execution",
    head: "+2.34% · Filled at $118.40",
    body: "Order routed through your broker. P&L and slippage logged automatically.",
  },
];

function McpVisual() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "60px 40px",
      }}
    >
      <div
        style={{
          background: SURFACE,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "24px 28px",
          minWidth: 180,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: FAINT,
            marginBottom: 8,
          }}
        >
          Source
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 600, color: INK }}>
          Your Agent
        </div>
      </div>

      <div
        style={{
          flex: 1,
          maxWidth: 240,
          position: "relative",
          height: 2,
          background: "rgba(153,225,217,0.25)",
          margin: "0 -1px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(153,225,217,0) 0%, rgba(153,225,217,1) 50%, rgba(153,225,217,0) 100%)",
            animation: "mcp-flow 2.4s linear infinite",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: -22,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: DISPLAY,
            fontSize: 10,
            fontWeight: 600,
            color: TEAL,
            letterSpacing: "0.18em",
          }}
        >
          MCP
        </span>
      </div>

      <div
        style={{
          background: SURFACE,
          border: "1px solid rgba(153,225,217,0.3)",
          borderRadius: 14,
          padding: "24px 28px",
          minWidth: 200,
          textAlign: "center",
          boxShadow: "0 0 40px rgba(153,225,217,0.12)",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: TEAL,
            marginBottom: 8,
          }}
        >
          Marketplace
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 600, color: INK }}>
          Byzant
        </div>
      </div>
    </div>
  );
}

function SignalVisual() {
  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 28,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEAL,
            background: "rgba(153,225,217,0.1)",
            padding: "4px 8px",
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          Signal
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: 11, color: FAINT }}>
          14:32:18 · Live
        </span>
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        {[
          ["TICKER", "NVDA"],
          ["SIGNAL", "Bullish +0.82"],
          ["CONFIDENCE", "82%"],
          ["SOURCE", "Whale Flow + Technical"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              background: "#0a0a0a",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 10,
                letterSpacing: "0.1em",
                color: FAINT,
              }}
            >
              {k}
            </span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 13,
                fontWeight: 600,
                color: k === "SIGNAL" ? TEAL : INK,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#0a0a0a",
          borderRadius: 8,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 10,
            letterSpacing: "0.1em",
            color: FAINT,
            marginBottom: 6,
          }}
        >
          1H TREND
        </div>
        <svg viewBox="0 0 400 60" width="100%" height="50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(153,225,217,0.35)" />
              <stop offset="100%" stopColor="rgba(153,225,217,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,48 L40,46 L80,42 L120,38 L160,40 L200,32 L240,28 L280,22 L320,18 L360,12 L400,8 L400,60 L0,60 Z"
            fill="url(#signalGrad)"
          />
          <path
            d="M0,48 L40,46 L80,42 L120,38 L160,40 L200,32 L240,28 L280,22 L320,18 L360,12 L400,8"
            fill="none"
            stroke={TEAL}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

function ApprovalVisual() {
  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 28,
        maxWidth: 540,
        margin: "0 auto",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(153,225,217,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(153,225,217,0.12)",
              border: "1px solid rgba(153,225,217,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 11,
              color: TEAL,
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: INK }}>
              Alpha-1
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, color: FAINT, marginTop: 1 }}>
              NVDA · $118.40
            </div>
          </div>
        </div>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: TEAL,
          }}
        >
          Awaiting your approval
        </span>
      </div>

      <div
        style={{
          background: "rgba(153,225,217,0.04)",
          border: "1px solid rgba(153,225,217,0.15)",
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 16,
        }}
      >
        <p style={{ fontFamily: SYS, fontSize: 13, color: INK, margin: 0, lineHeight: 1.55 }}>
          Agent requests to open a long position in NVDA. 50 shares · Est. $5,920
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[
          ["ENTRY", "$118.40"],
          ["STOP", "$113.20"],
          ["R/R", "1:3.2"],
          ["CONF", "82%"],
        ].map(([k, v]) => (
          <div key={k} style={{ background: SURFACE_2, borderRadius: 8, padding: "8px 10px" }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 8,
                letterSpacing: "0.12em",
                color: FAINT,
                marginBottom: 3,
              }}
            >
              {k}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, color: INK }}>
              {v}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            flex: 1,
            background: TEAL,
            color: "#000000",
            borderRadius: 8,
            padding: "9px 0",
            fontFamily: DISPLAY,
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Approve
        </div>
        <div
          style={{
            flex: 1,
            background: SURFACE_2,
            color: MUTED,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "9px 0",
            fontFamily: DISPLAY,
            fontSize: 12,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Decline
        </div>
      </div>
    </div>
  );
}

function ExecutionVisual() {
  const GREEN = "#4ade80";
  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 28,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: GREEN,
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: GREEN,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Filled
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 18,
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.01em",
            }}
          >
            NVDA · 50 shares @ $118.40
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {[
          ["P&L", "+$138.50 (+2.34%)", GREEN],
          ["SHARES", "50", INK],
          ["BROKER", "Alpaca", INK],
          ["ORDER ID", "#A-7142", INK],
          ["TIMESTAMP", "2026-05-04 14:42:08 UTC", INK],
        ].map(([k, v, c]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              background: "#0a0a0a",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 10,
                letterSpacing: "0.1em",
                color: FAINT,
              }}
            >
              {k}
            </span>
            <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: c }}>
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEP_VISUALS = [McpVisual, SignalVisual, ApprovalVisual, ExecutionVisual];

function FeatureFour() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const idx = stepRefs.current.findIndex((el) => el === entry.target);
            if (idx >= 0) setActiveStep(idx);
          }
        });
      },
      { threshold: [0.4, 0.6, 0.8], rootMargin: "-20% 0px -30% 0px" }
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(180deg, #000000 0%, #000000 30%, #1a1a1a 70%, #2a2a2a 100%)",
        padding: "120px 80px 0",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FeatureHeader
          headline="From signal to execution."
          body="Four steps. Zero emotion. Every trade ends in the arbiter's hands."
        />
      </div>

      <div
        className="signal-scroll"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.4fr) minmax(0, 0.6fr)",
          gap: 60,
          position: "relative",
        }}
      >
        {/* Vertical progress rail (far left of grid) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -28,
            top: 0,
            bottom: 0,
            width: 2,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${progress * 100}%`,
              background: TEAL,
              borderRadius: 999,
              transition: "height 0.15s linear",
            }}
          />
        </div>

        {/* LEFT — sticky */}
        <div className="signal-left" style={{ position: "relative" }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    color: TEAL,
                    fontWeight: 600,
                    marginBottom: 18,
                  }}
                >
                  {active.cat}
                </div>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: "clamp(28px, 3.4vw, 44px)",
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                    color: INK,
                    margin: "0 0 20px",
                    maxWidth: 420,
                  }}
                >
                  {active.head}
                </h3>
                <p
                  style={{
                    fontFamily: SYS,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: MUTED,
                    margin: 0,
                    maxWidth: 420,
                  }}
                >
                  {active.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
              {STEPS.map((s, i) => (
                <span
                  key={s.cat}
                  style={{
                    width: 22,
                    height: 2,
                    borderRadius: 999,
                    background: i <= activeStep ? TEAL : "rgba(255,255,255,0.15)",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — scrolling visuals */}
        <div className="signal-right" style={{ display: "flex", flexDirection: "column" }}>
          {STEPS.map((s, i) => {
            const Visual = STEP_VISUALS[i];
            return (
              <div
                key={s.cat}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Visual />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 0 120px" }}>
        <ReferenceLabel>04 · Signal to Execution →</ReferenceLabel>
      </div>
    </section>
  );
}

/* ─── Teal Pop ────────────────────────────────────────────────── */
function TealPop() {
  return (
    <section style={{ background: TEAL, padding: "120px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="teal-cards"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
        >
          <Reveal>
            <div
              style={{
                background: "#ffffff",
                color: "#000000",
                borderRadius: 16,
                padding: 56,
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                You are the arbiter.
              </p>
              <p
                style={{
                  fontFamily: SYS,
                  fontSize: 16,
                  color: "#444444",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                The agent analyzes. You decide. Always.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div
              style={{
                background: "#000000",
                color: INK,
                borderRadius: 16,
                padding: 56,
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: "clamp(96px, 14vw, 180px)",
                    fontWeight: 600,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    margin: 0,
                    color: TEAL,
                  }}
                >
                  0
                </p>
                <p
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    margin: "16px 0 0",
                  }}
                >
                  Emotional trades detected.
                </p>
              </div>
              <p
                style={{
                  fontFamily: SYS,
                  fontSize: 14,
                  color: MUTED,
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                AI agents have no ego, no fear, no greed. Only data.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What is Byzant?",
    a: "Byzant is an agentic trading infrastructure marketplace. It connects AI trading agents to institutional-grade data feeds, strategy bots, and risk modules — all built on the MCP (Model Context Protocol) standard. You activate the modules. Your agent does the work. You approve every decision.",
  },
  {
    q: "Do I need to know how to code to use Byzant?",
    a: "No. Byzant is built for both technical and non-technical traders. If you don't have an agent, Byzant provisions one for you — no setup, no terminals, no configuration required. If you're a developer with an existing agent, you connect it to Byzant's marketplace via MCP in minutes.",
  },
  {
    q: "Which brokerages does Byzant support?",
    a: "Byzant currently supports Alpaca Markets at launch, with Interactive Brokers coming in Phase 2. More brokerages are on the roadmap. If you only want access to data and intelligence modules, you can use Byzant without connecting a brokerage at all.",
  },
  {
    q: "Will my agent trade without my approval?",
    a: "Never. Every trade, every module activation, every agent action surfaces as an approval. You review the signal, the reasoning, the risk. Then you approve or decline. The agent never acts without your explicit sign-off.",
  },
  {
    q: "What AI models does Byzant support?",
    a: "Byzant supports Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google), Grok (xAI), OpenClaw, and custom/other frameworks via MCP. You choose which model powers your agent during onboarding.",
  },
  {
    q: "What is MCP and why does it matter?",
    a: "MCP (Model Context Protocol) is the standard that AI agents use to discover and consume external capabilities. Byzant is built on MCP from day one — meaning any MCP-compatible agent can plug into Byzant's marketplace instantly, with no custom integrations required.",
  },
  {
    q: "Is my brokerage account safe with Byzant?",
    a: "Byzant never stores your brokerage credentials. When you connect Alpaca, the connection is made via secure OAuth — the same standard used by major financial apps. Byzant can only surface trade requests for your approval. It cannot withdraw funds, transfer money, or act without your explicit sign-off. You are always in control.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: BG, padding: "140px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="faq-grid"
          style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 80 }}
        >
          <Reveal>
            <div>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: INK,
                  margin: "0 0 32px",
                  lineHeight: 1,
                }}
              >
                FAQ&apos;s
              </h2>
              <GhostPill href="mailto:hello@byzant.ai">Contact us</GhostPill>
            </div>
          </Reveal>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={i * 0.03}>
                  <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        padding: "22px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: DISPLAY,
                          fontSize: 18,
                          fontWeight: 500,
                          color: INK,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.q}
                      </span>
                      <span
                        style={{
                          fontFamily: DISPLAY,
                          fontSize: 22,
                          fontWeight: 300,
                          color: MUTED,
                          transition: "transform 0.25s ease",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            style={{
                              fontFamily: SYS,
                              fontSize: 15,
                              lineHeight: 1.65,
                              color: MUTED,
                              margin: "0 0 22px",
                              maxWidth: 720,
                            }}
                          >
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Closing CTA ─────────────────────────────────────────────── */
function ClosingCTA() {
  return (
    <section style={{ background: BG, padding: "180px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(44px, 6vw, 84px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: INK,
              margin: 0,
            }}
          >
            Built for agents.
            <br />
            Designed for arbiters.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: SYS,
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: FAINT,
              margin: "32px 0 44px",
            }}
          >
            Join the waitlist. Be first when we launch.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TealPill href="/signup">Join Waitlist</TealPill>
            <GhostPill href="/auth/login">Sign In</GhostPill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
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
    <footer style={{ background: BG, padding: "80px 80px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
            <ByzantLogo size={22} color="#ffffff" />
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
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" style={{ color: FAINT, textDecoration: "none" }}>
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Global keyframes & responsive styles ────────────────────── */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      @keyframes pulse {
        0%,
        100% {
          box-shadow: 0 0 0 1px rgba(153, 225, 217, 0.18) inset;
        }
        50% {
          box-shadow: 0 0 0 1px rgba(153, 225, 217, 0.5) inset, 0 0 30px rgba(153, 225, 217, 0.15);
        }
      }
      @keyframes pulse-dot {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.85);
        }
      }
      @keyframes scanline {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(2617px);
        }
      }
      .whale-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .whale-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .whale-scroll::-webkit-scrollbar-thumb {
        background: rgba(153, 225, 217, 0.35);
        border-radius: 999px;
      }
      .whale-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(153, 225, 217, 0.55);
      }
      .whale-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(153, 225, 217, 0.35) transparent;
      }
      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }
      @keyframes mcp-flow {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @media (max-width: 1024px) {
        .nav-row {
          padding: 16px 32px !important;
        }
        section {
          padding-left: 32px !important;
          padding-right: 32px !important;
        }
        footer {
          padding-left: 32px !important;
          padding-right: 32px !important;
        }
      }

      @media (max-width: 900px) {
        .nav-desktop {
          display: none !important;
        }
        .nav-signin {
          display: none !important;
        }
        .feature-header {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }
        .feature-grid {
          grid-template-columns: 1fr !important;
        }
        .hero-agents {
          grid-template-columns: 1fr !important;
        }
        .teal-cards {
          grid-template-columns: 1fr !important;
        }
        .faq-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }
        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 32px !important;
        }
        .trust-row {
          gap: 24px !important;
          justify-content: center !important;
        }
        .signal-scroll {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }
        .signal-left > div {
          position: relative !important;
          height: auto !important;
          padding-bottom: 32px !important;
        }
      }

      @media (max-width: 600px) {
        .footer-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main
      style={{
        background: BG,
        color: INK,
        fontFamily: SYS,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <GlobalStyles />
      <Navbar />
      <Hero />
      <TrustLogos />
      <FeatureOne />
      <FeatureTwo />
      <FeatureThree />
      <FeatureFour />
      <TealPop />
      <FAQSection />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
