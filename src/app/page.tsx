"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, AnimatePresence } from "framer-motion";
import AgentSequence from "@/components/landing/AgentSequence";

const MatrixBackground = dynamic(
  () => import("@/components/landing/MatrixBackground"),
  { ssr: false }
);


const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

/* ─── Waitlist Form ─────────────────────────────────────────────── */
function WaitlistForm({
  submitted, onSubmit, email, setEmail, size = "normal",
}: {
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  size?: "normal" | "large";
}) {
  if (submitted) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "14px 24px",
        background: "rgba(153,225,217,0.08)",
        border: "0.5px solid rgba(153,225,217,0.3)",
        borderRadius: 14, fontSize: 14,
        color: "#99E1D9", fontFamily: SANS,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6.5" stroke="#99E1D9" strokeWidth="1" />
          <path d="M4.5 7l1.8 1.8L9.5 4.5" stroke="#99E1D9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        You&apos;re on the list. We&apos;ll be in touch.
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", maxWidth: size === "large" ? 480 : 460, width: "100%" }}>
      <div style={{
        display: "flex", flex: 1,
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.2)",
        borderRadius: 14, overflow: "hidden",
        backdropFilter: "blur(8px)",
      }}>
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            padding: size === "large" ? "16px 20px" : "14px 18px",
            fontSize: size === "large" ? 15 : 14,
            color: "#F5F5F5", fontFamily: SANS, minWidth: 0,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#99E1D9", color: "#fff", border: "none",
            padding: size === "large" ? "12px 28px" : "10px 22px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            borderRadius: 11, margin: 4,
            letterSpacing: "0.01em", transition: "background 0.15s",
            fontFamily: SANS, whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#B2EBE5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#99E1D9")}
        >
          Join Waitlist
        </button>
      </div>
    </form>
  );
}

/* ─── Bento Card Static SVGs (top of card) ──────────────────────── */
function NodeNetworkSVG() {
  return (
    <svg width="100%" height="180" viewBox="0 0 380 180" fill="none" style={{ display: "block" }}>
      {[40,80,120,160,200,240,280,320,360].map(x =>
        [30,70,110,150].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill="rgba(153,225,217,0.15)" />
        ))
      )}
      <circle cx={60} cy={90} r={18} fill="rgba(153,225,217,0.08)" stroke="#99E1D9" strokeWidth={1} />
      <circle cx={190} cy={50} r={22} fill="rgba(153,225,217,0.12)" stroke="#99E1D9" strokeWidth={1.5} />
      <circle cx={190} cy={130} r={14} fill="rgba(153,225,217,0.06)" stroke="rgba(153,225,217,0.5)" strokeWidth={1} />
      <circle cx={310} cy={90} r={18} fill="rgba(153,225,217,0.08)" stroke="#99E1D9" strokeWidth={1} />
      <circle cx={130} cy={145} r={10} fill="rgba(153,225,217,0.06)" stroke="rgba(153,225,217,0.4)" strokeWidth={0.75} />
      <circle cx={250} cy={145} r={10} fill="rgba(153,225,217,0.06)" stroke="rgba(153,225,217,0.4)" strokeWidth={0.75} />
      <line x1={78} y1={90} x2={168} y2={55} stroke="rgba(153,225,217,0.3)" strokeWidth={0.75} />
      <line x1={78} y1={92} x2={168} y2={128} stroke="rgba(153,225,217,0.2)" strokeWidth={0.5} />
      <line x1={212} y1={52} x2={292} y2={88} stroke="rgba(153,225,217,0.3)" strokeWidth={0.75} />
      <line x1={212} y1={130} x2={292} y2={92} stroke="rgba(153,225,217,0.2)" strokeWidth={0.5} />
      <line x1={190} y1={72} x2={190} y2={116} stroke="rgba(153,225,217,0.25)" strokeWidth={0.75} />
      <line x1={140} y1={142} x2={176} y2={132} stroke="rgba(153,225,217,0.2)" strokeWidth={0.5} />
      <line x1={240} y1={142} x2={204} y2={132} stroke="rgba(153,225,217,0.2)" strokeWidth={0.5} />
      <rect x={182} y={42} width={16} height={16} rx={3} fill="#99E1D9" fillOpacity={0.6} />
      <path d="M186 50l3 3 5-5" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ApprovalSVG() {
  return (
    <svg width="100%" height="180" viewBox="0 0 320 180" fill="none" style={{ display: "block" }}>
      <circle cx={160} cy={90} r={70} stroke="rgba(61,214,140,0.08)" strokeWidth={1} />
      <circle cx={160} cy={90} r={50} stroke="rgba(61,214,140,0.12)" strokeWidth={1} />
      <circle cx={160} cy={90} r={34} fill="rgba(61,214,140,0.1)" stroke="#3dd68c" strokeWidth={1.5} />
      <path d="M146 90l10 10 18-18" stroke="#3dd68c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={160} cy={20} r={5} fill="rgba(61,214,140,0.4)" />
      <circle cx={230} cy={90} r={4} fill="rgba(61,214,140,0.25)" />
      <circle cx={160} cy={160} r={3} fill="rgba(61,214,140,0.2)" />
      <circle cx={90} cy={90} r={4} fill="rgba(61,214,140,0.25)" />
      <line x1={160} y1={25} x2={160} y2={56} stroke="rgba(61,214,140,0.15)" strokeWidth={0.75} strokeDasharray="3 3" />
      <line x1={225} y1={90} x2={194} y2={90} stroke="rgba(61,214,140,0.15)" strokeWidth={0.75} strokeDasharray="3 3" />
    </svg>
  );
}

function BarChartSVG() {
  const bars = [30, 52, 44, 68, 58, 80, 72, 88, 76, 95];
  return (
    <svg width="100%" height="140" viewBox="0 0 300 140" fill="none" style={{ display: "block" }}>
      {bars.map((h, i) => (
        <rect key={i} x={10 + i * 28} y={140 - h} width={20} height={h} rx={3}
          fill={i >= 7 ? "#3dd68c" : `rgba(153,225,217,${0.15 + i * 0.06})`} />
      ))}
      <line x1={0} y1={139} x2={300} y2={139} stroke="rgba(255,255,255,0.15)" strokeWidth={0.75} />
    </svg>
  );
}

function ProtocolSVG() {
  return (
    <svg width="100%" height="140" viewBox="0 0 280 140" fill="none" style={{ display: "block" }}>
      <line x1={20} y1={70} x2={260} y2={70} stroke="rgba(153,225,217,0.3)" strokeWidth={1} />
      {[40, 100, 140, 180, 240].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={70} r={8} fill="rgba(153,225,217,0.1)"
            stroke={i === 2 ? "#99E1D9" : "rgba(153,225,217,0.4)"}
            strokeWidth={i === 2 ? 1.5 : 1} />
          {i === 2 && <circle cx={x} cy={70} r={3} fill="#99E1D9" />}
        </g>
      ))}
      <text x={40} y={92} textAnchor="middle" fill="rgba(153,225,217,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">AGENT</text>
      <text x={100} y={92} textAnchor="middle" fill="rgba(153,225,217,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">MCP</text>
      <text x={140} y={92} textAnchor="middle" fill="#99E1D9" fontSize={7} fontFamily="var(--font-geist-mono)">Byzant</text>
      <text x={180} y={92} textAnchor="middle" fill="rgba(153,225,217,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">DATA</text>
      <text x={240} y={92} textAnchor="middle" fill="rgba(153,225,217,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">EXEC</text>
      {[40,100,140,180,240].map((x, i) => (
        <line key={i} x1={x} y1={62} x2={x} y2={42} stroke="rgba(153,225,217,0.15)" strokeWidth={0.75} strokeDasharray="2 2" />
      ))}
    </svg>
  );
}

/* ─── Bento Card Expanded Animated Visuals ──────────────────────── */
function ExpandedNodeGraph({ active }: { active: boolean }) {
  const nodes = [
    { x: 35,  y: 70, label: "AGENT" },
    { x: 130, y: 70, label: "MCP" },
    { x: 235, y: 18, label: "DATA" },
    { x: 235, y: 70, label: "RISK" },
    { x: 235, y: 122, label: "STRATEGY" },
  ];
  const lines: [number,number,number,number][] = [
    [51,70,112,70], [146,67,217,22], [146,70,217,70], [146,73,217,118],
  ];
  return (
    <svg width="100%" height="160" viewBox="0 0 280 160" fill="none">
      {lines.map(([x1,y1,x2,y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(153,225,217,0.3)" strokeWidth={0.75}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: i * 0.12, duration: 0.35 }}
        >
          <motion.circle cx={n.x} cy={n.y} r={15}
            fill="rgba(153,225,217,0.06)" stroke="#99E1D9" strokeWidth={1}
            animate={active ? { strokeOpacity: [0.3, 1, 0.3] } : { strokeOpacity: 0.3 }}
            transition={active ? { delay: i * 0.15 + 0.7, duration: 2.2, repeat: Infinity, ease: "easeInOut" } : {}}
          />
          <text x={n.x} y={n.y + 28} textAnchor="middle"
            fill="rgba(153,225,217,0.45)" fontSize={6.5}
            fontFamily="var(--font-geist-mono)">{n.label}</text>
        </motion.g>
      ))}
    </svg>
  );
}

function ApprovalMockup() {
  return (
    <div style={{
      background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 12, padding: "16px 20px", maxWidth: 340,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: "#99E1D9", fontFamily: MONO, letterSpacing: "0.1em" }}>AWAITING APPROVAL</span>
        <span style={{ fontSize: 10, color: "#3dd68c", fontFamily: MONO }}>● LIVE</span>
      </div>
      <div style={{ fontSize: 13, color: "#F5F5F5", fontFamily: SANS, marginBottom: 4 }}>
        Agent requests LONG in <strong>NVDA</strong>
      </div>
      <div style={{ fontSize: 11, color: "#666666", fontFamily: SANS, marginBottom: 16 }}>50 shares · Est. $5,920</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: "#99E1D9", color: "#0A0A0A", textAlign: "center", padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: SANS }}>Approve</div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#666666", textAlign: "center", padding: "8px 0", borderRadius: 6, fontSize: 12, fontFamily: SANS }}>Decline</div>
      </div>
    </div>
  );
}

function OptionsFlowHeatmap({ active }: { active: boolean }) {
  const COLS = 8;
  const ROWS = 6;
  const CELL = 28;
  const GAP = 4;
  const PAD = 12;
  const GRID_W = COLS * CELL + (COLS - 1) * GAP;
  const HOT = [10, 18, 27, 34, 43];

  const [flashCell, setFlashCell] = useState<number | null>(null);

  useEffect(() => {
    if (!active) { setFlashCell(null); return; }
    const pick = () => {
      const hotIdx = HOT[Math.floor(Math.random() * HOT.length)];
      setFlashCell(hotIdx);
    };
    pick();
    const id = setInterval(() => pick(), 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const baseOpacity = (i: number) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const seed = ((col * 0.37 + row * 0.61 + col * row * 0.07) * 7.3) % 1;
    return 0.08 + seed * 0.42;
  };
  const pulseDelay = (i: number) => ((i * 0.11) % 2.4);

  return (
    <div style={{ padding: "24px 0 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        position: "relative",
        padding: PAD,
        background: "#000000",
        borderRadius: 10,
        border: "0.5px solid rgba(153,225,217,0.1)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
          gap: GAP,
        }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const base = baseOpacity(i);
            const isHot = HOT.includes(i);
            const isFlash = flashCell === i;
            const peak = isHot ? 0.9 : Math.min(0.6, base * 1.9);
            return (
              <motion.div
                key={i}
                animate={active ? {
                  opacity: [base, peak, base],
                  scale: isFlash ? [1, 1.1, 1] : 1,
                } : { opacity: 0, scale: 1 }}
                transition={{
                  opacity: {
                    duration: isHot ? 1.8 : 2.4,
                    delay: pulseDelay(i),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: { duration: 0.5, ease: "easeOut" },
                }}
                style={{
                  width: CELL, height: CELL, borderRadius: 4,
                  background: "#99E1D9",
                  boxShadow: isHot ? "0 0 10px rgba(153,225,217,0.45)" : "none",
                }}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {flashCell !== null && active && (
            <motion.div
              key={flashCell}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              transition={{ duration: 2.2, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: -8,
                left: PAD + (flashCell % COLS) * (CELL + GAP) + CELL / 2,
                transform: "translate(-50%, -100%)",
                fontFamily: MONO, fontSize: 8,
                color: "#99E1D9",
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                background: "#000000",
                padding: "3px 8px",
                borderRadius: 4,
                border: "0.5px solid rgba(153,225,217,0.3)",
              }}
            >
              UNUSUAL ACTIVITY DETECTED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between",
        width: GRID_W + PAD * 2, marginTop: 12,
        fontFamily: MONO, fontSize: 9,
        color: "#99E1D9", letterSpacing: "0.14em",
      }}>
        <span>STRIKE SCAN</span>
        <span>LIVE FLOW</span>
      </div>
    </div>
  );
}

function EmotionChart({ active }: { active: boolean }) {
  const humanPath = "M 0,68 L 28,30 L 52,82 L 76,14 L 100,78 L 128,26 L 152,64 L 176,16 L 200,80 L 228,36 L 255,70 L 280,22";
  const agentPath  = "M 0,76 C 56,72 112,62 168,52 S 228,40 280,35";
  return (
    <svg width="100%" height="110" viewBox="0 0 280 110" fill="none">
      {[25,50,75].map(y => (
        <line key={y} x1={0} y1={y} x2={280} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
      ))}
      <motion.path d={humanPath} stroke="rgba(255,90,90,0.5)" strokeWidth={1.5}
        fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path d={agentPath} stroke="#3dd68c" strokeWidth={1.5}
        fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: "easeInOut" }}
      />
      <motion.text x={4} y={106} fill="rgba(255,90,90,0.5)" fontSize={7} fontFamily="var(--font-geist-mono)"
        initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.9 }}>
        HUMAN
      </motion.text>
      <motion.text x={242} y={106} fill="#3dd68c" fontSize={7} fontFamily="var(--font-geist-mono)"
        initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.1 }}>
        AGENT
      </motion.text>
    </svg>
  );
}

function AnimatedPipeline({ active }: { active: boolean }) {
  const nodes = [
    { x: 40,  label: "AGENT"  },
    { x: 100, label: "MCP"    },
    { x: 140, label: "Byzant" },
    { x: 180, label: "DATA"   },
    { x: 240, label: "EXEC"   },
  ];
  return (
    <svg width="100%" height="90" viewBox="0 0 280 90" fill="none">
      <line x1={20} y1={45} x2={260} y2={45} stroke="rgba(153,225,217,0.25)" strokeWidth={1} />
      {nodes.map((n, i) => (
        <motion.g key={i}
          animate={active ? { opacity: [0.25, 1, 0.25] } : { opacity: 0.25 }}
          transition={active ? {
            delay: i * 0.3, duration: 0.6,
            repeat: Infinity, repeatDelay: nodes.length * 0.3, ease: "easeInOut",
          } : { duration: 0.3 }}
        >
          <circle cx={n.x} cy={45} r={9} fill="rgba(153,225,217,0.08)"
            stroke={i === 2 ? "#99E1D9" : "rgba(153,225,217,0.4)"}
            strokeWidth={i === 2 ? 1.5 : 1} />
          {i === 2 && <circle cx={n.x} cy={45} r={3} fill="#99E1D9" />}
          <text x={n.x} y={66} textAnchor="middle" fill="rgba(153,225,217,0.4)"
            fontSize={7} fontFamily="var(--font-geist-mono)">{n.label}</text>
          <line x1={n.x} y1={36} x2={n.x} y2={20} stroke="rgba(153,225,217,0.12)"
            strokeWidth={0.75} strokeDasharray="2 2" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── Shared bento expand primitives ────────────────────────────── */
function BentoToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        position: "absolute", top: 16, right: 16, zIndex: 10,
        width: 26, height: 26, borderRadius: "50%",
        border: `0.5px solid ${isOpen ? "rgba(153,225,217,0.4)" : "rgba(255,255,255,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, lineHeight: 1,
        color: isOpen ? "#99E1D9" : "#555555",
        background: isOpen ? "rgba(153,225,217,0.06)" : "rgba(255,255,255,0.03)",
        userSelect: "none" as const,
        transition: "color 0.2s, border-color 0.2s, background 0.2s",
      }}
    >+</motion.div>
  );
}

function BentoExpanded({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Bento Grid ────────────────────────────────────────────────── */
function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openCard, setOpenCard] = useState<number | null>(null);

  function toggle(id: number) {
    setOpenCard(prev => prev === id ? null : id);
  }

  const expandedTextStyle: React.CSSProperties = {
    fontSize: 14, color: "#94a3b8", fontFamily: SANS,
    lineHeight: 1.7, margin: "0 0 20px",
  };

  function baseCard(id: number, bg: string, border: string): React.CSSProperties {
    const isOpen = openCard === id;
    return {
      background: isOpen ? "#1a1a1a" : bg,
      border: `0.5px solid ${border}`,
      borderRadius: 20,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      transition: "border-color 0.25s, transform 0.25s, background 0.3s",
    };
  }

  return (
    <section className="bento-section" style={{ background: "transparent", padding: "140px 0", position: "relative", zIndex: 1 }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-h2"
          style={{ textAlign: "left", fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em", color: "#F5F5F5", fontFamily: SANS, margin: "0 0 64px", maxWidth: 640 }}
        >
          Why traders choose Byzant.
        </motion.h2>

        {/* ── Row 1: 60/40 ── */}
        <div className="bento-row1" style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 16, marginBottom: 16 }}>

          {/* Card 1 — Agent-Native Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={baseCard(1, "#0F0F0F", "rgba(255,255,255,0.15)")}
            onClick={() => toggle(1)}
            onMouseEnter={e => { if (openCard !== 1) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = openCard === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <BentoToggleIcon isOpen={openCard === 1} />
            <div style={{ padding: "28px 28px 0", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
              <NodeNetworkSVG />
            </div>
            <div className="bento-card-content" style={{ padding: "24px 28px 20px" }}>
              <span style={{ fontSize: 11, color: "#99E1D9", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>01</span>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#F5F5F5", fontFamily: SANS, margin: "8px 0 10px" }}>Agent-Native Infrastructure</div>
              <div style={{ fontSize: 13, color: "#666666", fontFamily: SANS, lineHeight: 1.6 }}>
                Built on MCP protocol — the standard AI agents already speak. Plug in capabilities without configuration or custom integrations.
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openCard === 1 && (
                <BentoExpanded>
                  <div style={{ padding: "4px 28px 28px" }}>
                    <p style={expandedTextStyle}>
                      Every Byzant module is an MCP server. Your agent discovers, requests, and consumes capabilities — no hardcoded integrations, no developer required.
                    </p>
                    <ExpandedNodeGraph active={openCard === 1} />
                  </div>
                </BentoExpanded>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Card 2 — Human in Control */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            style={baseCard(2, "#141414", "rgba(61,214,140,0.15)")}
            onClick={() => toggle(2)}
            onMouseEnter={e => { if (openCard !== 2) { e.currentTarget.style.borderColor = "rgba(61,214,140,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(61,214,140,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <BentoToggleIcon isOpen={openCard === 2} />
            <div style={{ padding: "28px 28px 0", borderBottom: "0.5px solid rgba(61,214,140,0.08)" }}>
              <ApprovalSVG />
            </div>
            <div className="bento-card-content" style={{ padding: "24px 28px 20px" }}>
              <span style={{ fontSize: 11, color: "#99E1D9", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>02</span>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#F5F5F5", fontFamily: SANS, margin: "8px 0 10px" }}>Human in Control</div>
              <div style={{ fontSize: 13, color: "#666666", fontFamily: SANS, lineHeight: 1.6 }}>
                Your agent surfaces opportunities. You approve. Emotionless analysis without bias, fear, or greed.
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openCard === 2 && (
                <BentoExpanded>
                  <div style={{ padding: "4px 28px 28px" }}>
                    <p style={expandedTextStyle}>
                      Your agent never acts autonomously. It surfaces trade setups and signals — you approve or decline every action. Emotionless analysis, full human authority.
                    </p>
                    <ApprovalMockup />
                  </div>
                </BentoExpanded>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Row 2: three equal ── */}
        <div className="bento-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

          {/* Card 3 — Institutional Edge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            style={baseCard(3, "#0F0F0F", "rgba(255,255,255,0.15)")}
            onClick={() => toggle(3)}
            onMouseEnter={e => { if (openCard !== 3) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <BentoToggleIcon isOpen={openCard === 3} />
            <div style={{ padding: "24px 24px 0" }}>
              <BarChartSVG />
            </div>
            <div className="bento-card-content" style={{ padding: "16px 24px 20px" }}>
              <span style={{ fontSize: 11, color: "#99E1D9", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>03</span>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#F5F5F5", fontFamily: SANS, margin: "8px 0 8px" }}>Institutional Edge</div>
              <div style={{ fontSize: 12, color: "#666666", fontFamily: SANS, lineHeight: 1.6 }}>
                Premium tools once reserved for Wall Street — now modular, affordable, and agent-ready.
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openCard === 3 && (
                <BentoExpanded>
                  <div style={{ padding: "4px 24px 24px" }}>
                    <p style={expandedTextStyle}>
                      Whale tracking, congressional trade monitoring, dark pool signals, options flow — tools hedge funds pay six figures for, now modular and agent-ready.
                    </p>
                    <OptionsFlowHeatmap active={openCard === 3} />
                  </div>
                </BentoExpanded>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Card 4 — Zero Emotion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            style={{ ...baseCard(4, "#0F0F0F", "rgba(255,255,255,0.15)"), display: "flex", flexDirection: "column" }}
            onClick={() => toggle(4)}
            onMouseEnter={e => { if (openCard !== 4) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <BentoToggleIcon isOpen={openCard === 4} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", flex: "0 0 auto" }}>
              <div style={{ fontSize: 96, fontWeight: 600, fontFamily: MONO, color: "#99E1D9", letterSpacing: "-0.05em", lineHeight: 1, textShadow: "0 0 40px rgba(153,225,217,0.25)" }}>0</div>
              <div style={{ fontSize: 10, color: "#666666", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 12, textAlign: "center" }}>
                Emotional trades<br />detected
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openCard === 4 && (
                <BentoExpanded>
                  <div style={{ padding: "0 24px 24px" }}>
                    <p style={expandedTextStyle}>
                      AI agents have no fear, no greed, no FOMO. They execute your strategy exactly as defined — every time.
                    </p>
                    <EmotionChart active={openCard === 4} />
                  </div>
                </BentoExpanded>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Card 5 — MCP Native */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            style={baseCard(5, "#0F0F0F", "rgba(255,255,255,0.15)")}
            onClick={() => toggle(5)}
            onMouseEnter={e => { if (openCard !== 5) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <BentoToggleIcon isOpen={openCard === 5} />
            <div style={{ padding: "24px 24px 0" }}>
              <ProtocolSVG />
            </div>
            <div className="bento-card-content" style={{ padding: "16px 24px 20px" }}>
              <span style={{ fontSize: 11, color: "#99E1D9", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>05</span>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#F5F5F5", fontFamily: SANS, margin: "8px 0 8px" }}>MCP Native</div>
              <div style={{ fontSize: 12, color: "#666666", fontFamily: SANS, lineHeight: 1.6 }}>
                Every module speaks the language agents already understand. Zero friction deployment.
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openCard === 5 && (
                <BentoExpanded>
                  <div style={{ padding: "4px 24px 24px" }}>
                    <p style={expandedTextStyle}>
                      MCP is the protocol AI agents already speak. Byzant is built on it from day one — not retrofitted. Every module is plug-and-play for any MCP-compatible agent.
                    </p>
                    <AnimatedPipeline active={openCard === 5} />
                  </div>
                </BentoExpanded>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── MCP Compatibility Section ─────────────────────────────────── */
const MCP_ITEMS = [
  {
    title: "OpenClaw",
    desc: "The leading open-source autonomous trading agent. Byzant modules plug in natively via MCP.",
    icon: (
      <span style={{ fontSize: "24px", filter: "grayscale(1) brightness(0)" }}>🦞</span>
    ),
  },
  {
    title: "Claude (Anthropic)",
    desc: "The AI model powering most Byzant agents. Full MCP support out of the box.",
    icon: (
      <img
        src="/icons/anthropic.svg"
        alt="Anthropic"
        width="20"
        height="20"
        style={{ filter: "brightness(0) saturate(100%)" }}
      />
    ),
  },
  {
    title: "GPT-4 (OpenAI)",
    desc: "Compatible via any MCP-enabled agent framework built on GPT-4.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0L4.1992 14.2a4.4992 4.4992 0 0 1-1.8584-6.3044zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7865a4.504 4.504 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
      </svg>
    ),
  },
  {
    title: "Gemini (Google)",
    desc: "Google's flagship model, fully compatible via MCP protocol.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12"/>
      </svg>
    ),
  },
  {
    title: "Grok (xAI)",
    desc: "xAI's reasoning model, connects to Byzant modules via MCP standard.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    title: "LangChain",
    desc: "Build agents on LangChain and plug into Byzant's marketplace via MCP instantly.",
    icon: (
      <div style={{
        width: "32px",
        height: "32px",
        overflow: "hidden",
      }}>
        <img
          src="/icons/langchain.svg"
          alt="LangChain"
          style={{
            height: "64px",
            width: "auto",
            filter: "brightness(0) saturate(100%)",
            marginTop: "-16px",
          }}
        />
      </div>
    ),
  },
  {
    title: "Cursor",
    desc: "AI-powered IDE. Byzant modules surface trading context directly in your dev environment.",
    icon: (
      <img
        src="/icons/cursor.png"
        alt="Cursor"
        width="32"
        height="32"
        style={{ mixBlendMode: "multiply", filter: "contrast(1.5)" }}
      />
    ),
  },
];

function MCPCompatibilitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{
      background: "#ffffff",
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
      width: "100%",
      padding: "140px 0",
    }}>
      <img
        src="/icons/modelcontextprotocol.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -40,
          bottom: -40,
          width: 380,
          height: "auto",
          opacity: 0.25,
          filter: "brightness(0) saturate(100%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>
        <div className="mcp-grid" style={{
          display: "grid",
          gridTemplateColumns: "35fr 65fr",
          gap: "80px",
          alignItems: "start",
        }}>

          {/* LEFT — sticky title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ position: "sticky", top: 100 }}
          >
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#000000",
              fontFamily: SANS, margin: "0 0 24px", lineHeight: 1.1,
            }}>
              Works with<br />your agent.
            </h2>
            <p style={{
              fontSize: 16, color: "#111111", fontFamily: SANS,
              fontWeight: 400, lineHeight: 1.65, margin: 0, maxWidth: 280,
            }}>
              Byzant connects to any MCP-compatible agent or framework. No custom integrations. No setup required.
            </p>
          </motion.div>

          {/* RIGHT — item list */}
          <div>
            {/* Top divider */}
            <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.15)" }} />

            {MCP_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: "easeOut" }}
              >
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 20,
                  padding: "24px 0",
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    background: "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#000000", marginTop: 2,
                  }}>
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <div style={{
                      fontSize: 16, fontWeight: 600, color: "#000000",
                      fontFamily: SANS, marginBottom: 4,
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: 14, color: "#111111", fontFamily: SANS,
                      fontWeight: 400, lineHeight: 1.6,
                    }}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                {/* Row divider */}
                <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.15)" }} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Marketplace Preview ───────────────────────────────────────── */
const PREVIEW_MODULES = [
  { name: "Real-Time Market Data",  badge: "DATA",      desc: "Sub-millisecond quotes and level 2 order book direct to your agent.",            price: "$9/mo"  },
  { name: "Sentiment Analysis",     badge: "ANALYTICS", desc: "Earnings signals and news flow parsed for agent consumption.",                    price: "$29/mo" },
  { name: "Risk Management Suite",  badge: "RISK",      desc: "Dynamic position sizing and real-time portfolio risk scoring.",                   price: "$29/mo" },
  { name: "Dark Pool Monitor",      badge: "ANALYTICS", desc: "Institutional block trades and unusual activity alerts.",                         price: "$29/mo" },
  { name: "Trailing Stop Bot",      badge: "STRATEGY",  desc: "Automated stop loss management that trails as your position gains.",              price: "$29/mo" },
  { name: "Wheel Strategy Bot",     badge: "STRATEGY",  desc: "Automated put selling and covered call management for premium income.",           price: "$29/mo" },
  { name: "Whale Tracker",          badge: "PRO",       desc: "Unusual options flow and institutional dark pool activity in real time.",         price: "$29/mo" },
  { name: "Smart Money Tracker",    badge: "PRO",       desc: "Congressional trade disclosures tracked and surfaced automatically.",             price: "$29/mo" },
  { name: "Risk Agent",             badge: "PRO",       desc: "Always-on risk enforcement. Monitors every position. Requires approval to override.", price: "$29/mo" },
  { name: "Copy Trading Bot",       badge: "PRO",       desc: "Mirror top performing politicians and institutional whales automatically.",       price: "$29/mo" },
];

function MarketplacePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }

  return (
    <section className="preview-section" style={{ background: "transparent", padding: "140px 0", overflow: "hidden", position: "relative", zIndex: 1 }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header row: eyebrow + title + subhead left, arrows right */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: "#F5F5F5", fontFamily: SANS, margin: "0 0 10px" }}
            >
              The Module Marketplace
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{ fontSize: 15, color: "#666666", fontFamily: SANS, fontWeight: 300, margin: 0 }}
            >
              Your agent discovers. You approve. Institutional tools, retail price.
            </motion.p>
          </div>

          {/* Arrow buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {(["left", "right"] as const).map(dir => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#666666", fontSize: 16, transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#99E1D9"; (e.currentTarget as HTMLElement).style.color = "#99E1D9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#666666"; }}
                aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
              >
                {dir === "left" ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontally scrollable card row */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingTop: 12,
            paddingBottom: 12,
            paddingRight: 48, /* peek effect */
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {PREVIEW_MODULES.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.06 }}
              style={{
                flex: "0 0 260px",
                scrollSnapAlign: "start",
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(153,225,217,0.25)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {/* Badge */}
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#99E1D9",
                background: "rgba(153,225,217,0.10)", border: "0.5px solid rgba(153,225,217,0.2)",
                padding: "3px 8px", borderRadius: 999, fontFamily: MONO,
                display: "inline-block", marginBottom: 14, alignSelf: "flex-start",
              }}>
                {m.badge}
              </span>

              {/* Name */}
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F5F5F5", fontFamily: SANS, marginBottom: 8, lineHeight: 1.3 }}>
                {m.name}
              </div>

              {/* Desc */}
              <div style={{ fontSize: 12, color: "#666666", fontFamily: SANS, lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                {m.desc}
              </div>

              {/* Price */}
              <div style={{ fontSize: 13, color: "#99E1D9", fontFamily: MONO, fontWeight: 500, marginBottom: 14 }}>
                {m.price}
              </div>

              {/* Deploy button */}
              <Link
                href="/marketplace"
                style={{
                  display: "block", textAlign: "center",
                  background: "#99E1D9", color: "#0A0A0A",
                  fontFamily: SANS, fontWeight: 600, fontSize: 13,
                  padding: "10px 0", borderRadius: 8,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#B2EBE5")}
                onMouseLeave={e => (e.currentTarget.style.background = "#99E1D9")}
              >
                Deploy →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ───────────────────────────────────────────────── */
const FAQ_ITEMS: { q: string; a: string }[] = [
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
    a: "Never. Every trade, every module activation, every agent action requires your explicit approval. You are always the arbiter. The agent surfaces the decision — you make it.",
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
    q: "How much does Byzant cost?",
    a: "Byzant modules are priced at Basic ($9/mo), Pro ($29/mo), and Institutional ($99/mo). You only pay for the modules you activate. Stripe billing is coming in Phase 2 — early waitlist users will get priority access.",
  },
];

function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section style={{
      background: "#ffffff",
      position: "relative",
      zIndex: 1,
      width: "100%",
      padding: "140px 0",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>
        <div className="faq-grid" style={{
          display: "grid",
          gridTemplateColumns: "35fr 65fr",
          gap: 80,
          alignItems: "start",
        }}>
          {/* LEFT — sticky heading + contact button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ position: "sticky", top: 100 }}
          >
            <h2 style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#000000",
              fontFamily: SANS,
              lineHeight: 1.05,
              margin: "0 0 32px",
            }}>
              FAQ&apos;s
            </h2>
            <a
              href="mailto:hello@byzant.ai"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                border: "1px solid #000000",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                color: "#000000",
                background: "transparent",
                textDecoration: "none",
                fontFamily: SANS,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Contact us
            </a>
          </motion.div>

          {/* RIGHT — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.08)" }} />
            {FAQ_ITEMS.map((item, i) => {
              const open = openIdx === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 32,
                      padding: "24px 0",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: SANS,
                      color: "#000000",
                    }}
                  >
                    <span style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#000000",
                      fontFamily: SANS,
                      lineHeight: 1.4,
                    }}>
                      {item.q}
                    </span>
                    <span style={{
                      flexShrink: 0,
                      width: 18,
                      height: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `rotate(${open ? 45 : 0}deg)`,
                      transition: "transform 0.3s ease",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <line x1="9" y1="2" x2="9" y2="16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="2" y1="9" x2="16" y2="9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div style={{
                    overflow: "hidden",
                    maxHeight: open ? 500 : 0,
                    opacity: open ? 1 : 0,
                    transition: "max-height 0.3s ease, opacity 0.2s ease",
                  }}>
                    <p style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: "#94a3b8",
                      lineHeight: 1.65,
                      fontFamily: SANS,
                      margin: 0,
                      padding: "0 0 24px",
                      maxWidth: "70ch",
                    }}>
                      {item.a}
                    </p>
                  </div>
                  <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.08)" }} />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Teal CTA + Footer ─────────────────────────────────────────── */
function CTASectionTeal({
  email, setEmail, submitted, onSubmit,
}: {
  email: string; setEmail: (v: string) => void;
  submitted: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{
      background: "#99E1D9",
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
      marginTop: "-1px",
    }}>
      {/* ── CTA content ── */}
      <div ref={ref} style={{ maxWidth: 640, margin: "0 auto", padding: "160px 2rem 60px", textAlign: "center" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 400,
            letterSpacing: "-0.02em", color: "#000000",
            fontFamily: SANS, margin: "0 0 28px", lineHeight: 1.35,
          }}
        >
          Delivering institutional-grade trading infrastructure directly to AI agents.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ fontSize: 16, color: "#111111", fontFamily: SANS, fontWeight: 300, margin: "0 0 52px", lineHeight: 1.6 }}
        >
          Join the waitlist. Be first when we launch.<br />
          No spam. No commitments. Just early access.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {submitted ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px",
              background: "rgba(0,0,0,0.08)",
              border: "0.5px solid rgba(0,0,0,0.3)",
              borderRadius: 14, fontSize: 14,
              color: "#000000", fontFamily: SANS,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#000000" strokeWidth="1" />
                <path d="M4.5 7l1.8 1.8L9.5 4.5" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: "flex", maxWidth: 480, width: "100%" }}>
              <div style={{
                display: "flex", flex: 1,
                background: "#ffffff",
                border: "1px solid #000000",
                borderRadius: 14, overflow: "hidden",
              }}>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="cta-teal-input"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    padding: "16px 20px",
                    fontSize: 15,
                    color: "#000000", fontFamily: SANS, minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#000000", color: "#99E1D9", border: "none",
                    padding: "12px 28px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    borderRadius: 11, margin: 4,
                    letterSpacing: "0.01em", transition: "background 0.15s",
                    fontFamily: SANS, whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#111111")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* ── Social icons ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 48 }}>
          <a
            href="https://x.com/byzant_ai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Byzant on X"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "1px solid #000000",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000000", textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            {/* X (Twitter) logo */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Footer area ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 2rem 0" }}>
        {/* Nav links row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 36, flexWrap: "wrap" }}>
          {[
            { label: "Home", href: "/" },
            { label: "Marketplace", href: "#marketplace" },
            { label: "How it Works", href: "#how-it-works" },
            { label: "Sign In", href: "/auth" },
          ].map(l => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 12, color: "#000000", textDecoration: "none", fontFamily: MONO, letterSpacing: "0.05em", opacity: 0.75, transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.2)", marginBottom: 28 }} />

        {/* Copyright */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#000000", fontFamily: MONO, letterSpacing: "0.04em", margin: "0 0 0" }}>
          © 2026 Byzant · All Rights Reserved
        </p>
      </div>

      {/* ── Big Wordmark ── */}
      <div style={{
        textAlign: "center",
        lineHeight: 0.85,
        marginTop: 48,
        background: "#99E1D9",
        paddingBottom: 100,
        position: "relative",
        zIndex: 2,
      }}>
        <span style={{
          fontFamily: SANS,
          fontSize: "clamp(60px, 9vw, 110px)",
          fontWeight: 700,
          color: "#000000",
          letterSpacing: "-0.04em",
          display: "block",
          userSelect: "none",
          opacity: 1,
          WebkitTextFillColor: "#000000",
        }}>
          Byzant
        </span>
      </div>
    </section>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [submitted1, setSubmitted1] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F5F5", minHeight: "100vh", fontFamily: SANS, overflowX: "hidden", position: "relative", zIndex: 0 }}>
      <style>{`
        html { scroll-behavior: smooth; overscroll-behavior: none; }
        body { overscroll-behavior: none; }
        * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        .nav-link:hover { color: #F5F5F5 !important; }
        input::placeholder { color: #444444; }
        .cta-teal-input::placeholder { color: #6b7280; }
        html, body { background: #0A0A0A; }

        /* ── Scroll reveal ── */
        .sr { opacity: 0; transform: translateY(24px); }
        .sr.sr-in { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .sr-c > * { opacity: 0; transform: translateY(24px); }
        .sr-c.sr-in > *:nth-child(1) { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: 0ms; }
        .sr-c.sr-in > *:nth-child(2) { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: 80ms; }
        .sr-c.sr-in > *:nth-child(3) { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: 160ms; }
        .sr-c.sr-in > *:nth-child(4) { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: 240ms; }
        .sr-c.sr-in > *:nth-child(5) { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; transition-delay: 320ms; }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .agent-card-wrap { display: none !important; }
        }
        @media (max-width: 860px) {
          .mcp-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          /* Matrix background — fade out on mobile */
          .matrix-bg { opacity: 0.35 !important; }
          /* Nav */
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-inner { padding: 0 20px !important; }
          /* Hero */
          .hero-grid { padding: 64px 20px 36px !important; gap: 24px !important; }
          .hero-h1 { font-size: 34px !important; line-height: 1.1 !important; margin-bottom: 14px !important; }
          .hero-h2 { font-size: 28px !important; line-height: 1.1 !important; margin-bottom: 20px !important; }
          .hero-body { font-size: 14px !important; line-height: 1.6 !important; margin-bottom: 24px !important; }
          .hero-trust { gap: 8px !important; margin-top: 12px !important; flex-wrap: nowrap !important; justify-content: center !important; }
          .hero-tag { color: #666666 !important; font-size: 11px !important; gap: 8px !important; }
          /* Agent card on mobile */
          .agent-card-wrap { display: flex !important; width: 100% !important; margin-top: 24px !important; }
          .agent-card-inner { width: 100% !important; max-width: 100% !important; }
          /* Quote */
          .quote-section { padding: 1.5rem 1.5rem !important; }
          /* Stats */
          .stat-num { font-size: 26px !important; }
          /* Eyebrow labels */
          .eyebrow-label { font-size: 10px !important; letter-spacing: 0.18em !important; }
          /* Section headings */
          .section-h2 { font-size: 28px !important; margin-bottom: 28px !important; }
          /* Subtext */
          .seq-subtext { font-size: 13px !important; }
          /* Bento */
          .bento-section { padding: 40px 0 !important; }
          .bento-row1 { grid-template-columns: 1fr !important; gap: 10px !important; margin-bottom: 10px !important; }
          .bento-row2 { grid-template-columns: 1fr !important; gap: 10px !important; }
          .bento-card-content { padding: 14px 16px 16px !important; }
          /* Marketplace */
          .preview-section { padding: 60px 0 !important; }
          /* Agent sequence */
          .seq-section { padding: 44px 0 !important; }
          .seq-header { margin-bottom: 36px !important; }
          .agent-seq-row { flex-direction: column !important; gap: 10px !important; }
          .agent-seq-connector { display: none !important; }
          /* Stats bar */
          .stats-row { gap: 0 !important; }
        }
      `}</style>

      {/* ── MATRIX BACKGROUND (fixed, full page) ────────────────── */}
      <MatrixBackground />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled || menuOpen ? "#000000" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.1)" : "0.5px solid transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        {/* Main nav row */}
        <div className="nav-inner" style={{
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", position: "relative",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", letterSpacing: 0 }}>
            <span style={{ color: "#99E1D9", fontWeight: 500, fontSize: 21, fontFamily: "var(--font-geist-sans)", letterSpacing: 0, WebkitTextStroke: "0.8px white" }}>Byzant</span>
          </Link>

          {/* Desktop nav links — absolutely centered */}
          <div className="nav-desktop" style={{
            display: "flex", gap: 36,
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}>
            {[
              { label: "Marketplace", href: "#marketplace" },
              { label: "How it Works", href: "#how-it-works" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="nav-link"
                style={{ color: "#666666", fontSize: 14, textDecoration: "none", transition: "color 0.15s", fontFamily: SANS }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/auth"
              style={{ color: "#666666", fontSize: 13, textDecoration: "none", padding: "7px 18px", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontFamily: SANS, transition: "border-color 0.15s, color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#F5F5F5"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#666666"; }}>
              Sign In
            </Link>
            <Link href="/signup"
              style={{ background: "#99E1D9", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", padding: "7px 20px", borderRadius: 10, fontFamily: SANS, transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#B2EBE5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#99E1D9")}>
              Join Waitlist
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: "none", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "none", cursor: "pointer",
              padding: 8, color: "#F5F5F5",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="#F5F5F5" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            ) : (
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="#F5F5F5" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            padding: "20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {[
              { label: "Marketplace", href: "#marketplace" },
              { label: "How it Works", href: "#how-it-works" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#666666", fontSize: 15, textDecoration: "none", fontFamily: SANS, padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              <Link href="/auth"
                onClick={() => setMenuOpen(false)}
                style={{ color: "#F5F5F5", fontSize: 14, textDecoration: "none", padding: "10px 16px", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 10, fontFamily: SANS, textAlign: "center" }}>
                Sign In
              </Link>
              <Link href="/signup"
                onClick={() => setMenuOpen(false)}
                style={{ background: "#99E1D9", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 16px", borderRadius: 10, fontFamily: SANS, textAlign: "center" }}>
                Join Waitlist
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "transparent", zIndex: 2, width: "100%" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: "70%", height: "80%", background: "radial-gradient(ellipse at center, rgba(153,225,217,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1160, margin: "0 auto",
          padding: "240px 2rem 200px",
          width: "100%",
        }}>
          {/* Headline — line 1 */}
          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
              fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.05, margin: "0",
              color: "#ffffff", fontFamily: SANS,
            }}
          >
            Analysis without emotion.
          </motion.h1>

          {/* Headline — line 2 */}
          <motion.h2
            className="hero-h2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
              fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.05, margin: "0 0 56px",
              color: "#ffffff", fontFamily: SANS,
            }}
          >
            You are the arbiter.
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 16 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            style={{
              fontSize: 16, color: "#666666",
              fontFamily: SANS, fontWeight: 400,
              lineHeight: 1.65, maxWidth: 520,
              margin: "0 0 40px",
            }}
          >
            Byzant is the first agentic trading infrastructure marketplace — delivering institutional-grade capabilities directly to AI agents, so retail investors finally have the edge hedge funds always had.
          </motion.p>

          {/* Waitlist form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 12 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          >
            <WaitlistForm
              submitted={submitted1}
              onSubmit={(e) => { e.preventDefault(); if (email1) setSubmitted1(true); }}
              email={email1}
              setEmail={setEmail1}
            />
          </motion.div>
        </div>
      </section>

      {/* ── MCP COMPATIBILITY ───────────────────────────────────── */}
      <MCPCompatibilitySection />

      {/* ── BENTO GRID ──────────────────────────────────────────── */}
      <BentoGrid />

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <div id="how-it-works">
        <AgentSequence />
      </div>

      {/* ── MARKETPLACE PREVIEW ─────────────────────────────────── */}
      <div id="marketplace">
        <MarketplacePreview />
      </div>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── TEAL CTA + FOOTER ───────────────────────────────────── */}
      <CTASectionTeal
        email={email2} setEmail={setEmail2}
        submitted={submitted2}
        onSubmit={(e) => { e.preventDefault(); if (email2) setSubmitted2(true); }}
      />
    </div>
  );
}
