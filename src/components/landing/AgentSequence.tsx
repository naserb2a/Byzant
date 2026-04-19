"use client";
import { useRef } from "react";
import { motion, useInView, type Transition, type TargetAndTransition } from "framer-motion";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

type DataRow = { label: string; value: string; accent?: string };

function StepCard({
  step, badge, badgeMuted, title, titleSub, rows,
  statusColor, statusText, statusPulse,
  initial, animate, transition,
}: {
  step: string;
  badge: string; badgeMuted?: boolean;
  title: string; titleSub?: string;
  rows: DataRow[];
  statusColor: string; statusText: string; statusPulse?: boolean;
  initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition;
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={{ borderColor: "rgba(255,255,255,0.18)" }}
      className="seq-card"
      style={{
        flex: 1,
        background: "#0B0B0B",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 6,
        padding: "32px 30px",
        cursor: "default",
        transition: "border-color 0.3s",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top row: step number + badge */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 28,
      }}>
        <span style={{
          fontSize: 11, color: "#666666",
          fontFamily: MONO, letterSpacing: "0.1em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {step}
        </span>
        <span
          style={{
            fontSize: 10, fontWeight: 400, letterSpacing: "0.06em",
            color: badgeMuted ? "#7a7a7a" : "#99E1D9",
            fontFamily: MONO,
          }}
        >
          {badge}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 22, fontWeight: 500, color: "#F5F5F5",
        fontFamily: SANS, letterSpacing: "-0.015em",
        lineHeight: 1.25, marginBottom: titleSub ? 8 : 24,
      }}>
        {title}
      </div>
      {titleSub && (
        <div style={{
          fontSize: 13, color: "#7a7a7a",
          fontFamily: MONO, letterSpacing: "0.01em",
          lineHeight: 1.5, marginBottom: 28,
        }}>
          {titleSub}
        </div>
      )}

      {/* Data rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28, flex: 1 }}>
        {rows.map((r) => (
          <div key={r.label} style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            fontFamily: MONO, fontSize: 12.5,
            lineHeight: 1.4,
          }}>
            <span style={{ color: "#666666", letterSpacing: "0.01em" }}>
              {r.label}
            </span>
            <span style={{
              color: r.accent ?? "#D0D0D0",
              letterSpacing: "0.02em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>

      {/* Status footer */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        paddingTop: 18,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: statusColor, display: "inline-block",
          flexShrink: 0,
          animation: statusPulse ? "db-pulse 2s infinite" : "none",
        }} />
        <span style={{
          fontSize: 12, color: "#7a7a7a",
          fontFamily: MONO, letterSpacing: "0.01em",
        }}>
          {statusText}
        </span>
      </div>
    </motion.div>
  );
}

function Connector({ delay }: { delay: number }) {
  return (
    <div
      className="agent-seq-connector"
      style={{
        width: 40, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{
        width: "100%",
        borderTop: "1px dashed rgba(255,255,255,0.15)",
      }} />
      {/* Traveling dot */}
      <span
        className="seq-pulse"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: 5, height: 5,
          borderRadius: "50%",
          background: "#99E1D9",
          transform: "translate(-50%, -50%)",
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

export default function AgentSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="seq-section"
      style={{
        background: "transparent",
        padding: "180px 0",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes seq-flow {
          0%   { left: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .seq-pulse {
          animation: seq-flow 3s linear infinite;
        }
        @media (max-width: 900px) {
          .agent-seq-row { flex-direction: column !important; gap: 14px !important; }
          .agent-seq-connector { display: none !important; }
          .agent-seq-row > * { width: 100% !important; flex: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div className="seq-header" style={{ textAlign: "left", marginBottom: 80 }}>
          <motion.h2
            className="section-h2"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em",
              color: "#F5F5F5", fontFamily: SANS, margin: "0 0 14px",
              lineHeight: 1.05,
            }}
          >
            From signal to execution.
          </motion.h2>

          <motion.p
            className="seq-subtext"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{
              fontSize: 17, fontWeight: 300, color: "#888888",
              fontFamily: SANS, margin: 0, maxWidth: 560, lineHeight: 1.5,
            }}
          >
            Four steps. Zero emotion. Every trade ends in the arbiter&apos;s hands.
          </motion.p>
        </div>

        {/* Step cards */}
        <div className="agent-seq-row" style={{ display: "flex", alignItems: "stretch", gap: 0 }}>

          {/* Step 0 — MCP Connected */}
          <StepCard
            step="01"
            badge="MCP protocol"
            title="Agent · Byzant linked"
            titleSub="mcp://byzant.ai/v1"
            rows={[
              { label: "Protocol",  value: "MCP 1.2",  accent: "#D0D0D0" },
              { label: "Latency",   value: "12ms",     accent: "#99E1D9" },
              { label: "Handshake", value: "Verified", accent: "#99E1D9" },
            ]}
            statusColor="#99E1D9"
            statusText="Zero config · already speaking"
            statusPulse
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          />

          <Connector delay={0} />

          {/* Step 1 — Signal Detected */}
          <StepCard
            step="02"
            badge="Alpha-1"
            title="NVDA · bullish"
            titleSub="Signal +0.82 · 14:32:07 UTC"
            rows={[
              { label: "Source",     value: "Sentiment + flow", accent: "#D0D0D0" },
              { label: "Confidence", value: "82%",              accent: "#99E1D9" },
              { label: "Horizon",    value: "1–3 days",         accent: "#D0D0D0" },
            ]}
            statusColor="#99E1D9"
            statusText="Signal confirmed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          />

          <Connector delay={1} />

          {/* Step 2 — Approval Requested */}
          <StepCard
            step="03"
            badge="Pending"
            badgeMuted
            title="50sh long · $5,920"
            titleSub="Entry $118.40 · stop $114.90"
            rows={[
              { label: "Risk", value: "1.8% NAV", accent: "#D0D0D0" },
              { label: "R:R",  value: "2.6 : 1",  accent: "#99E1D9" },
              { label: "TTL",  value: "00:45",    accent: "#D0D0D0" },
            ]}
            statusColor="#f0b429"
            statusText="Awaiting your approval"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          />

          <Connector delay={2} />

          {/* Step 3 — Trade Executed */}
          <StepCard
            step="04"
            badge="Filled"
            title="+2.34% · filled at $118.40"
            titleSub="50sh · 14:32:11 UTC"
            rows={[
              { label: "P&L",          value: "+$138.52", accent: "#99E1D9" },
              { label: "Slippage",     value: "$0.01",    accent: "#D0D0D0" },
              { label: "Fill quality", value: "99.8%",    accent: "#99E1D9" },
            ]}
            statusColor="#99E1D9"
            statusText="Position opened"
            statusPulse
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
}
