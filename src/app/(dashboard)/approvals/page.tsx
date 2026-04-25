"use client";
import { useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ApprovalCard from "@/components/dashboard/ApprovalCard";
import TradingViewWidget from "@/components/dashboard/TradingViewWidget";
import InsightBubble from "@/components/dashboard/InsightBubble";

const MONO = "inherit";
const SANS = "inherit";

const APPROVALS = [
  {
    agentId: "ALPHA-1", agentName: "Alpha-1",
    ticker: "NVDA", price: "$118.40",
    desc: "Agent requests to open a long position in NVDA. 50 shares · Est. $5,920",
    meta: [
      { label: "Entry", value: "$118.40" },
      { label: "Stop Loss", value: "$113.20" },
      { label: "R/R Ratio", value: "1 : 3.2" },
      { label: "Confidence", value: "82%" },
    ],
  },
  {
    agentId: "GAMMA-3", agentName: "Gamma-3",
    ticker: "MODULE", price: "$29/mo",
    desc: "Agent requests access to Dark Pool Monitor module. Required for institutional flow detection.",
    meta: [
      { label: "Module", value: "Dark Pool" },
      { label: "Cost", value: "$29/mo" },
      { label: "Impact", value: "+11% edge" },
      { label: "Priority", value: "High" },
    ],
  },
  {
    agentId: "BETA-2", agentName: "Beta-2",
    ticker: "SPY", price: "$8,250",
    desc: "Agent requests to open a covered call position in SPY. 3 contracts · Est. $8,250 collateral",
    meta: [
      { label: "Strike", value: "$485" },
      { label: "Expiry", value: "Apr 18" },
      { label: "Premium", value: "$2.75" },
      { label: "Confidence", value: "60%" },
    ],
  },
];

const REASONING = [
  { label: "Observation", text: "NVDA showing sustained buying pressure over 3 sessions. Relative Strength vs SPY: +8.4%. Options flow skewed bullish 3:1.", accent: "blue" as const },
  { label: "Pattern Match", text: "Pre-earnings momentum setup. Historical win rate on this pattern: 74% over 24 occurrences.", accent: "green" as const },
  { label: "Action Proposed", text: "Enter long at market open. Scale to 50 shares. Hard stop at $113.20. Target $130.00.", accent: "amber" as const },
];

function isTradeable(ticker: string): boolean {
  return /^[A-Z]{1,5}$/.test(ticker);
}

export default function ApprovalsPage() {
  const [chatMsg, setChatMsg] = useState("");

  const tradeableIndexes = useMemo(
    () => APPROVALS.map((a, i) => (isTradeable(a.ticker) ? i : -1)).filter((i) => i >= 0),
    []
  );
  const [selectedIdx, setSelectedIdx] = useState<number>(tradeableIndexes[0] ?? 0);
  const selected = APPROVALS[selectedIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: "0 0 4px", fontFamily: SANS }}>
          Agent Approval Queue
        </h1>
        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SANS }}>3 pending decisions · Review and act</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <StatCard label="Pending" value="3" sub="Require your review" accent="amber" />
        <StatCard label="Approved Today" value="8" sub="Executed successfully" accent="green" />
        <StatCard label="Est. Position Value" value="$14.2k" sub="Total if all approved" accent="blue" />
      </div>

      {/* Approval cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {APPROVALS.map((a, i) => {
          const tradeable = isTradeable(a.ticker);
          return (
            <ApprovalCard
              key={a.agentId + a.ticker}
              {...a}
              selected={tradeable && i === selectedIdx}
              onSelect={tradeable ? () => setSelectedIdx(i) : undefined}
            />
          );
        })}
      </div>

      {/* Bottom 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
        {/* Live signal chart */}
        <div style={{
          position: "relative",
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20, marginBottom: 48,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>{selected.ticker} Signal Analysis</div>
              <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 2 }}>Live price action · {selected.agentName}</div>
            </div>
          </div>
          <div style={{
            position: "absolute", top: 20, right: 20,
            fontSize: 18, fontWeight: 700, color: "var(--db-green)", fontFamily: MONO,
            zIndex: 2,
          }}>
            {selected.price}
          </div>
          <TradingViewWidget symbol={selected.ticker} height={500} />
        </div>

        {/* Agent reasoning */}
        <div style={{
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Agent Reasoning · {selected.agentName}</div>
          {REASONING.map(r => <InsightBubble key={r.label} {...r} />)}

          {/* Chat input */}
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              placeholder="Ask agent to explain..."
              style={{
                flex: 1, background: "var(--db-bg3)", border: "1px solid var(--db-border)",
                borderRadius: 8, padding: "7px 10px", fontSize: 12,
                color: "var(--db-ink)", outline: "none", fontFamily: SANS,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--db-border-mid)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
            />
            <button style={{
              background: "var(--db-blue)", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: SANS, flexShrink: 0,
            }}>
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
