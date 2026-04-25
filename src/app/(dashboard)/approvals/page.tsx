"use client";
import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ApprovalCard from "@/components/dashboard/ApprovalCard";
import LineChart from "@/components/dashboard/LineChart";
import InsightBubble from "@/components/dashboard/InsightBubble";

const MONO = "inherit";
const SANS = "inherit";

const NVDA_PTS = [112, 114, 111, 116, 115, 118, 117, 119, 118, 121, 118, 120, 118, 118];

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

export default function ApprovalsPage() {
  const [chatMsg, setChatMsg] = useState("");

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
        {APPROVALS.map(a => <ApprovalCard key={a.agentId + a.ticker} {...a} />)}
      </div>

      {/* Bottom 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
        {/* NVDA signal chart */}
        <div style={{
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>NVDA Signal Analysis</div>
              <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 2 }}>14-session price action · Alpha-1</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--db-green)", fontFamily: MONO }}>$118.40</div>
          </div>
          <LineChart points={NVDA_PTS} color="var(--db-blue)" height={240} todayIdx={13} />
        </div>

        {/* Agent reasoning */}
        <div style={{
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Agent Reasoning · Alpha-1</div>
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
