"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import AgentSequence from "@/components/landing/AgentSequence";

const AnimatedAgentCard = dynamic(
  () => import("@/components/landing/AnimatedAgentCard"),
  { ssr: false }
);

const MatrixBackground = dynamic(
  () => import("@/components/landing/MatrixBackground"),
  { ssr: false }
);


const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

/* ─── Scroll reveal hook (native IntersectionObserver) ──────────── */
function useScrollReveal(rootMargin = "-40px 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return { ref, visible };
}

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
        background: "rgba(61,214,140,0.08)",
        border: "0.5px solid rgba(61,214,140,0.3)",
        borderRadius: 14, fontSize: 14,
        color: "#3dd68c", fontFamily: SANS,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6.5" stroke="#3dd68c" strokeWidth="1" />
          <path d="M4.5 7l1.8 1.8L9.5 4.5" stroke="#3dd68c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
        border: "0.5px solid rgba(99,157,255,0.2)",
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
            color: "#eef2ff", fontFamily: SANS, minWidth: 0,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#4d9fff", color: "#fff", border: "none",
            padding: size === "large" ? "12px 28px" : "10px 22px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            borderRadius: 11, margin: 4,
            letterSpacing: "0.01em", transition: "background 0.15s",
            fontFamily: SANS, whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6eb8ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4d9fff")}
        >
          Join Waitlist
        </button>
      </div>
    </form>
  );
}

/* ─── Count-up hook ─────────────────────────────────────────────── */
function useCountUp(target: number, trigger: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return count;
}

/* ─── Stats Bar ─────────────────────────────────────────────────── */
const STATS = [
  { num: 500, suffix: "+", label: "Waitlist Members" },
  { num: 9, suffix: "", label: "Capability Modules" },
  { num: 3, suffix: "", label: "Active Agent Types" },
  { num: 0, suffix: "", label: "Emotional Trades" },
];

function StatItem({ num, suffix, label, trigger }: { num: number; suffix: string; label: string; trigger: boolean }) {
  const count = useCountUp(num, trigger);
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 36, fontWeight: 600, color: "#eef2ff", fontFamily: MONO, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 10, color: "#7a8aab", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
}

function StatsBar() {
  const { ref, visible } = useScrollReveal();
  const inView = visible;
  return (
    <div
      ref={ref}
      className={visible ? "sr sr-in" : "sr"}
      style={{
        background: "#0d1420",
        borderTop: "0.5px solid rgba(99,157,255,0.12)",
        borderBottom: "0.5px solid rgba(99,157,255,0.12)",
        padding: "28px 0",
        width: "100%",
      }}
    >
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 2rem",
        display: "flex", alignItems: "center", gap: 0,
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <StatItem {...s} trigger={inView} />
            {i < STATS.length - 1 && (
              <div style={{ width: "0.5px", height: 40, background: "rgba(99,157,255,0.12)", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quote Section ─────────────────────────────────────────────── */
function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "-60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const line1Style: React.CSSProperties = {
    display: "block",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#94a3b8",
    letterSpacing: "0.02em",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  };

  const line2Style: React.CSSProperties = {
    display: "block",
    fontStyle: "normal",
    fontWeight: 400,
    color: "#e2e8f0",
    letterSpacing: "0.02em",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
    textShadow: visible ? "0 0 18px rgba(77,159,255,0.35), 0 0 40px rgba(77,159,255,0.12)" : "none",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,300&display=swap');
      `}</style>
      <div
        ref={ref}
        className="quote-section"
        style={{
          background: "#080c12",
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.19rem, 2.125vw, 1.7rem)",
            lineHeight: 1.5,
            margin: 0,
          }}>
            <span style={line1Style}>
              Analysis without emotion.
            </span>
            <span style={line2Style}>
              You are the arbiter.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Bento Card SVGs ───────────────────────────────────────────── */
function NodeNetworkSVG() {
  return (
    <svg width="100%" height="180" viewBox="0 0 380 180" fill="none" style={{ display: "block" }}>
      {/* Grid dots */}
      {[40,80,120,160,200,240,280,320,360].map(x =>
        [30,70,110,150].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill="rgba(77,159,255,0.15)" />
        ))
      )}
      {/* Nodes */}
      <circle cx={60} cy={90} r={18} fill="rgba(77,159,255,0.08)" stroke="#4d9fff" strokeWidth={1} />
      <circle cx={190} cy={50} r={22} fill="rgba(77,159,255,0.12)" stroke="#4d9fff" strokeWidth={1.5} />
      <circle cx={190} cy={130} r={14} fill="rgba(77,159,255,0.06)" stroke="rgba(77,159,255,0.5)" strokeWidth={1} />
      <circle cx={310} cy={90} r={18} fill="rgba(77,159,255,0.08)" stroke="#4d9fff" strokeWidth={1} />
      <circle cx={130} cy={145} r={10} fill="rgba(77,159,255,0.06)" stroke="rgba(77,159,255,0.4)" strokeWidth={0.75} />
      <circle cx={250} cy={145} r={10} fill="rgba(77,159,255,0.06)" stroke="rgba(77,159,255,0.4)" strokeWidth={0.75} />
      {/* Lines */}
      <line x1={78} y1={90} x2={168} y2={55} stroke="rgba(77,159,255,0.3)" strokeWidth={0.75} />
      <line x1={78} y1={92} x2={168} y2={128} stroke="rgba(77,159,255,0.2)" strokeWidth={0.5} />
      <line x1={212} y1={52} x2={292} y2={88} stroke="rgba(77,159,255,0.3)" strokeWidth={0.75} />
      <line x1={212} y1={130} x2={292} y2={92} stroke="rgba(77,159,255,0.2)" strokeWidth={0.5} />
      <line x1={190} y1={72} x2={190} y2={116} stroke="rgba(77,159,255,0.25)" strokeWidth={0.75} />
      <line x1={140} y1={142} x2={176} y2={132} stroke="rgba(77,159,255,0.2)" strokeWidth={0.5} />
      <line x1={240} y1={142} x2={204} y2={132} stroke="rgba(77,159,255,0.2)" strokeWidth={0.5} />
      {/* Center icon */}
      <rect x={182} y={42} width={16} height={16} rx={3} fill="#4d9fff" fillOpacity={0.6} />
      <path d="M186 50l3 3 5-5" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ApprovalSVG() {
  return (
    <svg width="100%" height="180" viewBox="0 0 320 180" fill="none" style={{ display: "block" }}>
      {/* Background ring */}
      <circle cx={160} cy={90} r={70} stroke="rgba(61,214,140,0.08)" strokeWidth={1} />
      <circle cx={160} cy={90} r={50} stroke="rgba(61,214,140,0.12)" strokeWidth={1} />
      {/* Main checkmark circle */}
      <circle cx={160} cy={90} r={34} fill="rgba(61,214,140,0.1)" stroke="#3dd68c" strokeWidth={1.5} />
      <path d="M146 90l10 10 18-18" stroke="#3dd68c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Orbiting dots */}
      <circle cx={160} cy={20} r={5} fill="rgba(61,214,140,0.4)" />
      <circle cx={230} cy={90} r={4} fill="rgba(61,214,140,0.25)" />
      <circle cx={160} cy={160} r={3} fill="rgba(61,214,140,0.2)" />
      <circle cx={90} cy={90} r={4} fill="rgba(61,214,140,0.25)" />
      {/* Connecting lines */}
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
        <rect
          key={i}
          x={10 + i * 28} y={140 - h}
          width={20} height={h}
          rx={3}
          fill={i >= 7 ? "#4d9fff" : `rgba(77,159,255,${0.15 + i * 0.06})`}
        />
      ))}
      <line x1={0} y1={139} x2={300} y2={139} stroke="rgba(99,157,255,0.15)" strokeWidth={0.75} />
    </svg>
  );
}

function ProtocolSVG() {
  return (
    <svg width="100%" height="140" viewBox="0 0 280 140" fill="none" style={{ display: "block" }}>
      {/* Horizontal bus */}
      <line x1={20} y1={70} x2={260} y2={70} stroke="rgba(77,159,255,0.3)" strokeWidth={1} />
      {/* Nodes on bus */}
      {[40, 100, 140, 180, 240].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={70} r={8} fill="rgba(77,159,255,0.1)" stroke={i === 2 ? "#4d9fff" : "rgba(77,159,255,0.4)"} strokeWidth={i === 2 ? 1.5 : 1} />
          {i === 2 && <circle cx={x} cy={70} r={3} fill="#4d9fff" />}
        </g>
      ))}
      {/* Labels */}
      <text x={40} y={92} textAnchor="middle" fill="rgba(77,159,255,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">AGENT</text>
      <text x={100} y={92} textAnchor="middle" fill="rgba(77,159,255,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">MCP</text>
      <text x={140} y={92} textAnchor="middle" fill="#4d9fff" fontSize={7} fontFamily="var(--font-geist-mono)">B2A</text>
      <text x={180} y={92} textAnchor="middle" fill="rgba(77,159,255,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">DATA</text>
      <text x={240} y={92} textAnchor="middle" fill="rgba(77,159,255,0.4)" fontSize={7} fontFamily="var(--font-geist-mono)">EXEC</text>
      {/* Vertical ticks */}
      {[40,100,140,180,240].map((x, i) => (
        <line key={i} x1={x} y1={62} x2={x} y2={42} stroke="rgba(77,159,255,0.15)" strokeWidth={0.75} strokeDasharray="2 2" />
      ))}
    </svg>
  );
}

/* ─── Bento Grid ────────────────────────────────────────────────── */
function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cardStyle = (bg: string, border?: string): React.CSSProperties => ({
    background: bg,
    border: `0.5px solid ${border ?? "rgba(99,157,255,0.15)"}`,
    borderRadius: 20,
    overflow: "hidden",
    cursor: "default",
    transition: "border-color 0.25s, transform 0.25s",
  });

  return (
    <section className="bento-section" style={{ background: "#080c12", padding: "120px 0" }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: "0 auto", padding: "0 2rem" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}
        >
          <div style={{ width: 24, height: "0.5px", background: "#4d9fff" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "#4d9fff", fontFamily: MONO, fontWeight: 600 }}>
            <span style={{ textTransform: "uppercase" }}>WHY </span>B2Acapital
          </span>
          <div style={{ width: 24, height: "0.5px", background: "#4d9fff" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            textAlign: "center", fontSize: 48, fontWeight: 600,
            letterSpacing: "-0.03em", color: "#eef2ff",
            fontFamily: SANS, margin: "0 auto 64px", maxWidth: 640,
          }}
        >
          Built for how agents actually trade.
        </motion.h2>

        {/* Row 1: 60/40 */}
        <div className="bento-row1" style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 16, marginBottom: 16 }}>
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={cardStyle("#0d1420")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ padding: "28px 28px 0", borderBottom: "0.5px solid rgba(99,157,255,0.08)" }}>
              <NodeNetworkSVG />
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <span style={{ fontSize: 11, color: "#4d9fff", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>01</span>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, margin: "8px 0 10px" }}>
                Agent-Native Infrastructure
              </div>
              <div style={{ fontSize: 13, color: "#7a8aab", fontFamily: SANS, lineHeight: 1.6 }}>
                Built on MCP protocol — the standard AI agents already speak. Plug in capabilities without configuration or custom integrations.
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            style={cardStyle("#111b2e", "rgba(61,214,140,0.15)")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(61,214,140,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(61,214,140,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ padding: "28px 28px 0", borderBottom: "0.5px solid rgba(61,214,140,0.08)" }}>
              <ApprovalSVG />
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <span style={{ fontSize: 11, color: "#3dd68c", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>02</span>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, margin: "8px 0 10px" }}>
                Human in Control
              </div>
              <div style={{ fontSize: 13, color: "#7a8aab", fontFamily: SANS, lineHeight: 1.6 }}>
                Your agent surfaces opportunities. You approve. Emotionless analysis without bias, fear, or greed.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2: three equal */}
        <div className="bento-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            style={cardStyle("#0d1420")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ padding: "24px 24px 0" }}>
              <BarChartSVG />
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <span style={{ fontSize: 11, color: "#4d9fff", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>03</span>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, margin: "8px 0 8px" }}>
                Institutional Edge
              </div>
              <div style={{ fontSize: 12, color: "#7a8aab", fontFamily: SANS, lineHeight: 1.6 }}>
                Premium tools once reserved for Wall Street — now modular, affordable, and agent-ready.
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Zero Emotion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            style={{ ...cardStyle("#0d1420"), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              fontSize: 96, fontWeight: 600, fontFamily: MONO,
              color: "#3dd68c", letterSpacing: "-0.05em", lineHeight: 1,
              textShadow: "0 0 40px rgba(61,214,140,0.25)",
            }}>
              0
            </div>
            <div style={{ fontSize: 10, color: "#7a8aab", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 12, textAlign: "center" }}>
              Emotional trades<br />detected
            </div>
          </motion.div>

          {/* Card 5 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            style={cardStyle("#0d1420")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ padding: "24px 24px 0" }}>
              <ProtocolSVG />
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <span style={{ fontSize: 11, color: "#4d9fff", fontFamily: MONO, letterSpacing: "0.1em", fontWeight: 600 }}>05</span>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, margin: "8px 0 8px" }}>
                MCP Native
              </div>
              <div style={{ fontSize: 12, color: "#7a8aab", fontFamily: SANS, lineHeight: 1.6 }}>
                Every module speaks the language agents already understand. Zero friction deployment.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Marketplace Preview ───────────────────────────────────────── */
const PREVIEW_MODULES = [
  { name: "Real-Time Market Data", badge: "DATA", desc: "Sub-millisecond quotes, level 2 order book direct to your agent.", price: "$9/mo", color: "#4d9fff" },
  { name: "Sentiment Analysis", badge: "ANALYTICS", desc: "Earnings signals and news flow parsed for agent consumption.", price: "$29/mo", color: "#6eb8ff" },
  { name: "Risk Management Suite", badge: "RISK", desc: "Dynamic position sizing and real-time portfolio risk scoring.", price: "$29/mo", color: "#f0b429" },
  { name: "Dark Pool Monitor", badge: "ANALYTICS", desc: "Institutional block trades and unusual activity alerts.", price: "$29/mo", color: "#6eb8ff" },
];

function MarketplacePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#0d1420", padding: "120px 0" }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 24, height: "0.5px", background: "#4d9fff" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "#4d9fff", fontFamily: MONO, fontWeight: 600, textTransform: "uppercase" }}>
            THE MARKETPLACE
          </span>
          <div style={{ width: 24, height: "0.5px", background: "#4d9fff" }} />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: "center", fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em", color: "#eef2ff", fontFamily: SANS, margin: "0 auto 12px", maxWidth: 600 }}
        >
          The Module Marketplace
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ textAlign: "center", fontSize: 16, color: "#7a8aab", fontFamily: SANS, fontWeight: 300, margin: "0 auto 56px", maxWidth: 480 }}
        >
          Your agent discovers. You approve. Institutional tools, retail price.
        </motion.p>

        {/* Module cards row */}
        <div className="preview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {PREVIEW_MODULES.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              style={{
                background: "#080c12",
                border: "0.5px solid rgba(99,157,255,0.1)",
                borderRadius: 16, padding: 20,
                cursor: "default",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,157,255,0.28)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,157,255,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: m.color,
                background: `${m.color}18`, border: `0.5px solid ${m.color}33`,
                padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
                display: "inline-block", marginBottom: 12,
              }}>
                {m.badge}
              </span>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#eef2ff", fontFamily: SANS, marginBottom: 8, lineHeight: 1.3 }}>
                {m.name}
              </div>
              <div style={{ fontSize: 11, color: "#7a8aab", fontFamily: SANS, lineHeight: 1.55, marginBottom: 16, flex: 1 }}>
                {m.desc}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#4d9fff", fontFamily: MONO }}>{m.price}</span>
                <span style={{ fontSize: 11, color: "#4d9fff", fontFamily: SANS, cursor: "default" }}>Deploy →</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/dashboard/marketplace"
            style={{ fontSize: 13, color: "#4d9fff", fontFamily: SANS, textDecoration: "none", letterSpacing: "0.01em" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#6eb8ff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#4d9fff")}
          >
            Browse all modules →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Full-bleed CTA ────────────────────────────────────────────── */
function CTASection({
  email, setEmail, submitted, onSubmit,
}: {
  email: string; setEmail: (v: string) => void;
  submitted: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{
      position: "relative", background: "transparent",
      padding: "160px 0", overflow: "hidden",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(77,159,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div ref={ref} style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", marginBottom: 28,
            background: "rgba(77,159,255,0.08)",
            border: "0.5px solid rgba(99,157,255,0.3)",
            borderRadius: 999,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4d9fff", display: "inline-block" }} />
          <span style={{ fontSize: 10, color: "#4d9fff", fontFamily: MONO, letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>
            EARLY ACCESS
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700,
            letterSpacing: "-0.04em", color: "#eef2ff",
            fontFamily: SANS, margin: "0 0 16px",
          }}
        >
          Ready to give your<br />agent an edge?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ fontSize: 16, color: "#7a8aab", fontFamily: SANS, fontWeight: 300, margin: "0 0 40px" }}
        >
          Join the waitlist. Be first when we launch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
        >
          <WaitlistForm email={email} setEmail={setEmail} submitted={submitted} onSubmit={onSubmit} size="large" />
        </motion.div>

        {!submitted && (
          <p style={{ fontSize: 11, color: "#2e3d5a", fontFamily: MONO, letterSpacing: "0.04em" }}>
            No spam. No commitments. Just early access.
          </p>
        )}
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
    <div style={{ background: "#080c12", color: "#eef2ff", minHeight: "100vh", fontFamily: SANS, overflowX: "hidden" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        .nav-link:hover { color: #eef2ff !important; }
        input::placeholder { color: #2e3d5a; }

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
        @media (max-width: 768px) {
          /* Nav */
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-inner { padding: 0 20px !important; }
          /* Hero */
          .hero-grid { padding: 96px 20px 60px !important; gap: 40px !important; }
          .hero-h1 { font-size: 36px !important; }
          .hero-h2 { font-size: 36px !important; }
          /* Quote */
          .quote-section { padding: 3rem 1.5rem !important; }
          /* Bento */
          .bento-section { padding: 80px 0 !important; }
          .bento-row1 { grid-template-columns: 1fr !important; }
          .bento-row2 { grid-template-columns: 1fr !important; }
          /* Marketplace */
          .preview-grid { grid-template-columns: 1fr !important; }
          /* Agent sequence */
          .agent-seq-row { flex-direction: column !important; }
          .agent-seq-connector { display: none !important; }
          /* Stats */
          .stats-row { gap: 0 !important; }
        }
      `}</style>

      {/* ── MATRIX BACKGROUND (fixed, full page) ────────────────── */}
      <MatrixBackground />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled || menuOpen ? "rgba(8,12,18,0.96)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(99,157,255,0.1)" : "0.5px solid transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        {/* Main nav row */}
        <div className="nav-inner" style={{
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", letterSpacing: 0 }}>
            <span style={{ color: "#4d9fff", fontWeight: 500, fontSize: 15, letterSpacing: "0.06em", fontFamily: MONO, textTransform: "uppercase" }}>B2A</span>
            <span style={{ color: "#eef2ff", fontWeight: 500, fontSize: 15, letterSpacing: "0.06em", fontFamily: MONO }}>capital</span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-desktop" style={{ display: "flex", gap: 36 }}>
            {[
              { label: "Marketplace", href: "#marketplace" },
              { label: "How it Works", href: "#how-it-works" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="nav-link"
                style={{ color: "#7a8aab", fontSize: 14, textDecoration: "none", transition: "color 0.15s", fontFamily: SANS }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/auth/login"
              style={{ color: "#7a8aab", fontSize: 13, textDecoration: "none", padding: "7px 18px", border: "0.5px solid rgba(99,157,255,0.15)", borderRadius: 10, fontFamily: SANS, transition: "border-color 0.15s, color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.35)"; e.currentTarget.style.color = "#eef2ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,157,255,0.15)"; e.currentTarget.style.color = "#7a8aab"; }}>
              Sign In
            </Link>
            <Link href="/auth/signup"
              style={{ background: "#4d9fff", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", padding: "7px 20px", borderRadius: 10, fontFamily: SANS, transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#6eb8ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "#4d9fff")}>
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
              padding: 8, color: "#eef2ff",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="#eef2ff" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            ) : (
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="#eef2ff" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{
            borderTop: "0.5px solid rgba(99,157,255,0.1)",
            padding: "20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {[
              { label: "Marketplace", href: "#marketplace" },
              { label: "How it Works", href: "#how-it-works" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#7a8aab", fontSize: 15, textDecoration: "none", fontFamily: SANS, padding: "10px 0", borderBottom: "0.5px solid rgba(99,157,255,0.06)" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              <Link href="/auth/login"
                onClick={() => setMenuOpen(false)}
                style={{ color: "#eef2ff", fontSize: 14, textDecoration: "none", padding: "10px 16px", border: "0.5px solid rgba(99,157,255,0.2)", borderRadius: 10, fontFamily: SANS, textAlign: "center" }}>
                Sign In
              </Link>
              <Link href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                style={{ background: "#4d9fff", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 16px", borderRadius: 10, fontFamily: SANS, textAlign: "center" }}>
                Join Waitlist
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ position: "relative", display: "flex", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "60%", height: "70%", background: "radial-gradient(ellipse at center, rgba(77,159,255,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="hero-grid" style={{
          position: "relative", zIndex: 1,
          maxWidth: 1200, margin: "0 auto",
          padding: "120px 48px 80px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 80, alignItems: "center", width: "100%",
        }}>
          {/* LEFT */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: heroVisible ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
            >
              <div style={{ width: 20, height: "0.5px", background: "#4d9fff" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "#4d9fff", fontFamily: MONO, fontWeight: 600, textTransform: "uppercase" }}>
                Agentic Trading Infrastructure
              </span>
              <div style={{ width: 20, height: "0.5px", background: "#4d9fff" }} />
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="hero-h1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 6px", color: "#eef2ff", fontFamily: SANS }}
            >
              The market never sleeps.
            </motion.h1>
            <motion.h2
              className="hero-h2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
              style={{ fontSize: 72, fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 32px", color: "#7a8aab", fontFamily: SANS }}
            >
              Neither does your agent.
            </motion.h2>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 16 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ fontSize: 18, color: "#7a8aab", fontFamily: SANS, fontWeight: 300, lineHeight: 1.65, maxWidth: 560, margin: "0 0 40px" }}
            >
              B2Acapital is the first marketplace built for AI trading agents — giving retail investors access to the same institutional-grade tools, data, and intelligence that hedge funds have always had.
            </motion.p>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 12 }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              <WaitlistForm
                submitted={submitted1}
                onSubmit={(e) => { e.preventDefault(); if (email1) setSubmitted1(true); }}
                email={email1}
                setEmail={setEmail1}
              />
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: heroVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}
            >
              {["MCP Protocol Native", "Human-in-the-loop", "Emotionless Execution"].map((t, i) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: i === 0 ? 0 : 16, fontFamily: MONO, fontSize: 10, color: "#4d9fff", letterSpacing: "0.06em" }}>
                  {i > 0 && <span style={{ color: "#2e3d5a" }}>·</span>}
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Floating agent card */}
          <div className="agent-card-wrap" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              style={{ position: "relative" }}
            >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              style={{ position: "relative" }}
            >
              {/* Glow behind card */}
              <div style={{
                position: "absolute", inset: "-40px",
                background: "radial-gradient(ellipse at center, rgba(77,159,255,0.12) 0%, transparent 70%)",
                borderRadius: 60, pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <AnimatedAgentCard />
              </div>
            </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <StatsBar />

      {/* ── QUOTE ───────────────────────────────────────────────── */}
      <QuoteSection />

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

      {/* ── FULL-BLEED CTA ──────────────────────────────────────── */}
      <CTASection
        email={email2} setEmail={setEmail2}
        submitted={submitted2}
        onSubmit={(e) => { e.preventDefault(); if (email2) setSubmitted2(true); }}
      />

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{
        background: "#0d1420",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          padding: "32px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ color: "#4d9fff", fontWeight: 700, fontSize: 18, fontFamily: SANS }}>B2A</span>
            <span style={{ color: "#eef2ff", fontWeight: 700, fontSize: 18, fontFamily: SANS }}>capital</span>
          </Link>

          {/* Copyright */}
          <span style={{ fontSize: 12, color: "#7a8aab", fontFamily: MONO, letterSpacing: "0.04em" }}>
            © 2026 B2Acapital · All Rights Reserved
          </span>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { label: "Marketplace", href: "#marketplace" },
              { label: "How it Works", href: "#how-it-works" },
              { label: "Sign In", href: "/auth/login" },
            ].map(l => (
              <Link key={l.label} href={l.href}
                style={{ fontSize: 13, color: "#7a8aab", textDecoration: "none", fontFamily: SANS, transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#eef2ff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7a8aab")}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
