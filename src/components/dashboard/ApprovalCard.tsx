"use client";
import { useState } from "react";

interface ApprovalCardProps {
  agentId: string;
  agentName: string;
  ticker: string;
  price: string;
  desc: string;
  meta: { label: string; value: string }[];
  defaultApproved?: boolean;
}

export default function ApprovalCard({
  agentId, agentName, ticker, price, desc, meta, defaultApproved = false,
}: ApprovalCardProps) {
  const [approved, setApproved] = useState(defaultApproved);

  return (
    <div style={{
      background: "var(--db-bg2)",
      border: `0.5px solid ${approved ? "rgba(61,214,140,0.25)" : "var(--db-border)"}`,
      borderRadius: 6,
      padding: 20,
      display: "flex", flexDirection: "column", gap: 16,
      transition: "border-color 0.25s",
    }}>
      {/* Agent avatar + ticker */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--db-blue-dim)", border: "1px solid var(--db-border-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--db-blue)",
            fontFamily: "inherit",
          }}>
            {agentId[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--db-ink)", fontFamily: "inherit" }}>{agentName}</div>
            <div style={{ fontSize: 10, color: "var(--db-ink-muted)", fontFamily: "inherit", marginTop: 1 }}>{agentId}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--db-ink)", fontFamily: "inherit" }}>{ticker}</div>
          <div style={{ fontSize: 12, color: "var(--db-blue)", fontFamily: "inherit" }}>{price}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: "var(--db-blue-glow)",
        border: "1px solid var(--db-border-mid)",
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--db-blue)", fontFamily: "inherit", marginBottom: 5 }}>
          Awaiting your approval
        </div>
        <p style={{ fontSize: 14, color: "var(--db-ink-muted)", lineHeight: 1.55, margin: 0, fontFamily: "inherit" }}>{desc}</p>
      </div>

      {/* 2x2 meta grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {meta.map((m) => (
          <div key={m.label} style={{ background: "var(--db-bg3)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 9, color: "var(--db-ink-faint)", fontFamily: "inherit", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--db-ink)", fontFamily: "inherit" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setApproved(true)}
          style={{
            flex: 1, background: approved ? "var(--db-green-dim)" : "var(--db-blue)",
            color: approved ? "var(--db-green)" : "#fff",
            border: approved ? "1px solid rgba(61,214,140,0.3)" : "none",
            borderRadius: 10, padding: "10px 0", fontSize: 12.5, fontWeight: 600,
            cursor: approved ? "default" : "pointer",
            transition: "background 0.25s, color 0.25s",
            fontFamily: "inherit",
          }}
        >
          {approved ? "Approved ✓" : "Approve"}
        </button>
        <button
          onClick={() => setApproved(false)}
          style={{
            flex: 1, background: "var(--db-bg3)", color: "var(--db-ink-muted)",
            border: "1px solid var(--db-border)", borderRadius: 10, padding: "10px 0",
            fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            transition: "background 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--db-bg4)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--db-bg3)")}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
