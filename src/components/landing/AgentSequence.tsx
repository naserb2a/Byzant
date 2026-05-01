"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

type Item = {
  step: string;
  label: string;
  title: string;
  body: string;
  active?: boolean;
};

const ITEMS: Item[] = [
  {
    step: "01",
    label: "MCP Protocol",
    title: "Agent · Byzant linked",
    body: "Your agent speaks Byzant natively via MCP. Zero configuration, millisecond handshake.",
    active: true,
  },
  {
    step: "02",
    label: "Signal",
    title: "NVDA · Bullish +0.82",
    body: "Sentiment, flow, and pattern inputs aggregate into a single conviction score.",
  },
  {
    step: "03",
    label: "Approval",
    title: "Awaiting your decision",
    body: "Every trade surfaces a concise brief. Size, risk, horizon. You hold the final click.",
  },
  {
    step: "04",
    label: "Execution",
    title: "+2.34% · Filled at $118.40",
    body: "Order routed through your broker. P&L and slippage logged automatically.",
  },
];

export default function AgentSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "180px 0",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <style>{`
        @media (max-width: 820px) {
          .seq-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .seq-line { display: none !important; }
          .seq-item-dot-wrap { padding-top: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: 96 }}>
          <motion.h2
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
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{
              fontSize: 17, fontWeight: 300, color: "#94a3b8",
              fontFamily: SANS, margin: 0, maxWidth: 560, lineHeight: 1.5,
            }}
          >
            Four steps. Zero emotion. Every trade ends in the arbiter&apos;s hands.
          </motion.p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Horizontal line */}
          <div
            className="seq-line"
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />

          {/* Items */}
          <div
            className="seq-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 40,
              position: "relative",
            }}
          >
            {ITEMS.map((it, i) => (
              <motion.div
                key={it.step}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" }}
              >
                {/* Dot */}
                <div className="seq-item-dot-wrap" style={{ paddingTop: 0, marginBottom: 28, display: "flex", alignItems: "center", height: 8 }}>
                  <span
                    style={{
                      width: it.active ? 8 : 6,
                      height: it.active ? 8 : 6,
                      borderRadius: "50%",
                      background: it.active ? "#99E1D9" : "rgba(255,255,255,0.2)",
                      display: "inline-block",
                    }}
                  />
                </div>

                {/* Step + label */}
                <div style={{
                  fontFamily: MONO, fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.08em",
                  marginBottom: 14,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {it.step}  ·  {it.label}
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: SANS, fontSize: 17, fontWeight: 500,
                  color: "#ffffff", letterSpacing: "-0.01em",
                  lineHeight: 1.3, marginBottom: 10,
                }}>
                  {it.title}
                </div>

                {/* Body */}
                <div style={{
                  fontFamily: SANS, fontSize: 13,
                  color: "#666666", lineHeight: 1.6,
                }}>
                  {it.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
