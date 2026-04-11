"use client";
import { useRef } from "react";
import { motion, useInView, type Transition, type TargetAndTransition } from "framer-motion";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

function StepCard({
  icon, badge, badgeColor, badgeBg, value, statusColor, statusText, statusPulse,
  initial, animate, transition,
}: {
  icon: React.ReactNode;
  badge: string; badgeColor: string; badgeBg: string;
  value: string;
  statusColor: string; statusText: string; statusPulse?: boolean;
  initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition;
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={{ borderColor: "rgba(99,157,255,0.35)" }}
      style={{
        flex: 1,
        background: "#0d1420",
        border: "0.5px solid rgba(99,157,255,0.12)",
        borderRadius: 16,
        padding: 24,
        cursor: "default",
        transition: "border-color 0.2s",
      }}
    >
      {/* Top row: icon + badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(77,159,255,0.1)",
          border: "0.5px solid rgba(99,157,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: badgeColor, background: badgeBg,
          border: `0.5px solid ${badgeColor}33`,
          padding: "2px 8px", borderRadius: 999,
          fontFamily: MONO,
        }}>
          {badge}
        </span>
      </div>

      {/* Main value */}
      <div style={{ fontSize: 15, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, marginBottom: 14 }}>
        {value}
      </div>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: statusColor, display: "inline-block",
          flexShrink: 0,
          animation: statusPulse ? "db-pulse 2s infinite" : "none",
        }} />
        <span style={{ fontSize: 10, color: "#7a8aab", fontFamily: MONO, letterSpacing: "0.06em" }}>
          {statusText}
        </span>
      </div>
    </motion.div>
  );
}

function Connector() {
  return (
    <div className="agent-seq-connector" style={{ width: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: "100%", height: 1, background: "rgba(99,157,255,0.2)" }} />
      <motion.div
        animate={{ x: [-16, 16, -16] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 6, height: 6, borderRadius: "50%",
          background: "#4d9fff",
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
      style={{
        background: "#080c12",
        padding: "80px 0",
        width: "100%",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .agent-seq-row { flex-direction: column !important; }
          .agent-seq-connector { display: none !important; }
          .agent-seq-row > * { width: 100% !important; flex: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: "#4d9fff" }} />
            <span style={{
              fontSize: 11, letterSpacing: "0.14em", color: "#4d9fff",
              fontFamily: MONO, fontWeight: 600, textTransform: "uppercase",
            }}>
              HOW IT WORKS
            </span>
            <div style={{ width: 24, height: 1, background: "#4d9fff" }} />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em",
              color: "#eef2ff", fontFamily: SANS, margin: "0 0 12px",
            }}
          >
            From signal to execution.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{
              fontSize: 16, fontWeight: 300, color: "#7a8aab",
              fontFamily: SANS, margin: 0,
            }}
          >
            Four steps. Zero emotion.
          </motion.p>
        </div>

        {/* Step cards */}
        <div className="agent-seq-row" style={{ display: "flex", alignItems: "stretch", gap: 0 }}>

          {/* Step 0 — MCP Connected */}
          <StepCard
            icon={
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M6 4H3a1 1 0 00-1 1v6a1 1 0 001 1h3" stroke="#4d9fff" strokeWidth={1.4} strokeLinecap="round" />
                <path d="M10 4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3" stroke="#4d9fff" strokeWidth={1.4} strokeLinecap="round" />
                <path d="M6 8h4" stroke="#4d9fff" strokeWidth={1.4} strokeLinecap="round" />
                <circle cx={5} cy={8} r={1.5} fill="#4d9fff" />
                <circle cx={11} cy={8} r={1.5} fill="#4d9fff" />
              </svg>
            }
            badge="MCP PROTOCOL"
            badgeColor="#4d9fff"
            badgeBg="rgba(77,159,255,0.1)"
            value="Agent · B2A linked"
            statusColor="#4d9fff"
            statusText="Zero config. Already speaking."
            statusPulse
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <Connector />

          {/* Step 1 — Signal Detected */}
          <StepCard
            icon={
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M2 11l3-4 3 3 3-5 3 3" stroke="#4d9fff" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            badge="ALPHA-1"
            badgeColor="#4d9fff"
            badgeBg="rgba(77,159,255,0.1)"
            value="NVDA · Bullish +0.82"
            statusColor="#3dd68c"
            statusText="Signal confirmed"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          />

          <Connector />

          {/* Step 2 — Approval Requested */}
          <StepCard
            icon={
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <circle cx={8} cy={8} r={6.5} stroke="#f0b429" strokeWidth={1.4} />
                <path d="M5.5 8l2 2 3-3.5" stroke="#f0b429" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            badge="PENDING"
            badgeColor="#f0b429"
            badgeBg="rgba(240,180,41,0.1)"
            value="50sh Long · $5,920"
            statusColor="#f0b429"
            statusText="Awaiting your approval"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />

          <Connector />

          {/* Step 3 — Trade Executed */}
          <StepCard
            icon={
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M9 2L5 9h4l-2 5 6-7H9l2-5z" stroke="#3dd68c" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            badge="FILLED"
            badgeColor="#3dd68c"
            badgeBg="rgba(61,214,140,0.1)"
            value="+2.34% · Filled at $118.40"
            statusColor="#3dd68c"
            statusText="Position opened"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
}
