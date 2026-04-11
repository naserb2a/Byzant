"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
} from "framer-motion";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

const ROWS = [
  { label: "SIGNAL",        value: "Bullish +0.82",      vc: "#3dd68c" },
  { label: "ENTRY",         value: "$118.40",             vc: "#eef2ff" },
  { label: "STOP LOSS",     value: "$113.20",             vc: "#eef2ff" },
  { label: "RISK / REWARD", value: "1 : 3.2",             vc: "#3dd68c" },
  { label: "DATA SOURCES",  value: "Polygon · Benzinga",  vc: "#4d9fff" },
  { label: "EMOTION",       value: "None detected",       vc: "#7a8aab" },
];

const BAR_HEIGHTS = [30, 40, 35, 50, 45, 55, 48, 60, 52, 70, 80, 90];

function useCountUp(target: number, trigger: boolean, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) { setCount(0); return; }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return count;
}

export default function AnimatedAgentCard() {
  const cardControls    = useAnimationControls();
  const headerControls  = useAnimationControls();
  const ringControls    = useAnimationControls();
  const panelControls   = useAnimationControls();
  const panelTextControls = useAnimationControls();
  const approveControls = useAnimationControls();

  const [rowsVisible,  setRowsVisible]  = useState(false);
  const [barsVisible,  setBarsVisible]  = useState(false);
  const [ringTrigger,  setRingTrigger]  = useState(false);
  const [approved,     setApproved]     = useState(false);
  const [cardBorder,   setCardBorder]   = useState("rgba(99,157,255,0.28)");
  const [dotScale,     setDotScale]     = useState(1);

  const score = useCountUp(82, ringTrigger);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    async function runLoop() {
      while (mountedRef.current) {
        // — Reset state —
        setRowsVisible(false);
        setBarsVisible(false);
        setRingTrigger(false);
        setApproved(false);
        setCardBorder("rgba(99,157,255,0.28)");

        await cardControls.set({ opacity: 0, y: 16 });
        await headerControls.set({ opacity: 0 });
        await ringControls.set({ strokeDashoffset: 113, opacity: 0 });
        await panelControls.set({ opacity: 0, y: 20, pointerEvents: "none" });
        await panelTextControls.set({ opacity: 0 });
        await approveControls.set({ scale: 1 });

        if (!mountedRef.current) break;

        // PHASE 1 — Card entrance
        await cardControls.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } });
        await headerControls.start({ opacity: 1, transition: { duration: 0.4 } });

        if (!mountedRef.current) break;

        // PHASE 2 — Rows type in
        setRowsVisible(true);

        // PHASE 3 — Score ring (overlaps phase 2)
        await new Promise(r => setTimeout(r, 1500));
        if (!mountedRef.current) break;
        setRingTrigger(true);
        await ringControls.start({ opacity: 1, strokeDashoffset: 20, transition: { duration: 1, ease: "easeOut" } });

        // PHASE 4 — Bars
        await new Promise(r => setTimeout(r, 200));
        if (!mountedRef.current) break;
        setBarsVisible(true);
        await new Promise(r => setTimeout(r, 900));

        // PHASE 5 — Approval panel slides up
        if (!mountedRef.current) break;
        await panelControls.start({ opacity: 1, y: 0, pointerEvents: "auto", transition: { type: "spring", stiffness: 120, damping: 14 } });
        await panelTextControls.start({ opacity: 1, transition: { duration: 0.35, delay: 0.1 } });
        await new Promise(r => setTimeout(r, 700));

        // PHASE 6 — Approve pulse then confirm
        if (!mountedRef.current) break;
        await approveControls.start({ scale: 1.04, transition: { duration: 0.18 } });
        await approveControls.start({ scale: 1, transition: { duration: 0.18 } });
        await approveControls.start({ scale: 1.04, transition: { duration: 0.18 } });
        await approveControls.start({ scale: 1, transition: { duration: 0.18 } });
        if (!mountedRef.current) break;
        setApproved(true);
        setCardBorder("rgba(61,214,140,0.5)");
        await new Promise(r => setTimeout(r, 350));
        setCardBorder("rgba(99,157,255,0.28)");

        // PHASE 7 — Hold approved state
        await new Promise(r => setTimeout(r, 1500));

        // PHASE 8 — Fade out
        if (!mountedRef.current) break;
        await cardControls.start({ opacity: 0, y: -8, transition: { duration: 0.5 } });
        await new Promise(r => setTimeout(r, 400));
      }
    }

    runLoop();
    return () => { mountedRef.current = false; };
  }, [cardControls, headerControls, ringControls, panelControls, panelTextControls, approveControls]);

  // Dot pulse loop
  useEffect(() => {
    let cancel = false;
    async function pulse() {
      while (!cancel) {
        setDotScale(1.4);
        await new Promise(r => setTimeout(r, 600));
        setDotScale(1);
        await new Promise(r => setTimeout(r, 600));
      }
    }
    pulse();
    return () => { cancel = true; };
  }, []);

  const ringCircumference = 2 * Math.PI * 18; // r=18 → ~113

  return (
    <motion.div
      animate={cardControls}
      initial={{ opacity: 0, y: 16 }}
      className="agent-card-inner"
      style={{
        width: 420,
        background: "#0d1420",
        border: `0.5px solid ${cardBorder}`,
        borderRadius: 20,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        fontFamily: MONO,
      }}
    >
      {/* Header */}
      <motion.div
        animate={headerControls}
        initial={{ opacity: 0 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "0.5px solid rgba(99,157,255,0.08)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Score ring */}
          <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
            <svg width={44} height={44} viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(77,159,255,0.15)" strokeWidth={3} />
              <motion.circle
                cx={22} cy={22} r={18} fill="none"
                stroke="#4d9fff" strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                animate={ringControls}
                initial={{ strokeDashoffset: ringCircumference, opacity: 0 }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#4d9fff", fontFamily: MONO,
            }}>
              {score}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#7a8aab", textTransform: "uppercase" }}>
              AGENT · NVDA ANALYSIS
            </div>
            <div style={{ fontSize: 10, color: "#2e3d5a", marginTop: 2, letterSpacing: "0.04em" }}>
              Alpha-1 · Equities Momentum
            </div>
          </div>
        </div>

        {/* Live dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#3dd68c",
            display: "inline-block",
            transform: `scale(${dotScale})`,
            transition: "transform 0.3s ease",
          }} />
          <span style={{ fontSize: 10, color: "#3dd68c", letterSpacing: "0.1em", fontWeight: 600 }}>LIVE</span>
        </div>
      </motion.div>

      {/* Data rows */}
      <div style={{ padding: "4px 0" }}>
        {ROWS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: 12 }}
            animate={rowsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: 0.3, delay: i * 0.18, ease: "easeOut" }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 18px",
              borderBottom: i < ROWS.length - 1 ? "0.5px solid rgba(99,157,255,0.08)" : "none",
            }}
          >
            <span style={{ fontSize: 10, color: "#2e3d5a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {row.label}
            </span>
            <span style={{ fontSize: 12, color: row.vc, fontVariantNumeric: "tabular-nums" }}>
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Mini bar chart */}
      <div style={{ padding: "12px 18px", borderTop: "0.5px solid rgba(99,157,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
          {BAR_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={barsVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "2px 2px 0 0",
                background: i >= 9 ? "#4d9fff" : "#2e3d5a",
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      </div>

      {/* Approval panel — always in DOM, controlled via panelControls */}
      <motion.div
        animate={panelControls}
        initial={{ opacity: 0, y: 20 }}
        style={{
          margin: "0 16px 16px",
          background: "rgba(77,159,255,0.08)",
          border: "0.5px solid rgba(99,157,255,0.25)",
          borderRadius: 14,
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={panelTextControls}
          initial={{ opacity: 0 }}
          style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4d9fff", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}
        >
          AWAITING YOUR APPROVAL
        </motion.div>
        <motion.p
          animate={panelTextControls}
          initial={{ opacity: 0 }}
          style={{ fontSize: 13, color: "#7a8aab", lineHeight: 1.55, margin: "0 0 14px", fontFamily: SANS }}
        >
          Agent requests to open a long position in{" "}
          <span style={{ color: "#eef2ff", fontWeight: 500 }}>NVDA</span>. 50 shares · Est.{" "}
          <span style={{ color: "#eef2ff", fontWeight: 500 }}>$5,920</span>
        </motion.p>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button
            animate={approveControls}
            style={{
              flex: 1,
              background: approved ? "#3dd68c" : "#4d9fff",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 0", fontSize: 13, fontWeight: 600,
              cursor: "default", fontFamily: SANS,
              transition: "background 0.3s ease",
            }}
          >
            {approved ? "Approved ✓" : "Approve"}
          </motion.button>
          <button style={{
            flex: 1, background: "#111b2e", color: "#7a8aab",
            border: "0.5px solid rgba(99,157,255,0.2)", borderRadius: 10,
            padding: "10px 0", fontSize: 13, fontWeight: 500,
            cursor: "default", fontFamily: SANS,
          }}>
            Decline
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
