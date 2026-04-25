"use client";
import StatusPill from "@/components/dashboard/StatusPill";

const MONO = "inherit";
const SANS = "inherit";

const ROWS = [
  { ts: "2026-04-05 09:31:04", status: "success"  as const, type: "Trade Executed",     agent: "Alpha-1",  ticker: "NVDA",  detail: "Long 50sh @ $118.40 · Filled" },
  { ts: "2026-04-05 09:30:18", status: "pending"  as const, type: "Approval Request",   agent: "Gamma-3",  ticker: "XLK",   detail: "Long 30sh @ $214.60 · Awaiting" },
  { ts: "2026-04-05 09:28:55", status: "success"  as const, type: "Module Activated",   agent: "Beta-2",   ticker: "—",     detail: "Risk Management Suite v2.1" },
  { ts: "2026-04-05 09:22:40", status: "declined" as const, type: "Trade Declined",     agent: "Beta-2",   ticker: "QQQ",   detail: "Put spread rejected by user" },
  { ts: "2026-04-05 09:18:11", status: "success"  as const, type: "Signal Generated",   agent: "Alpha-1",  ticker: "NVDA",  detail: "Bullish momentum · Score 82" },
  { ts: "2026-04-05 09:12:04", status: "success"  as const, type: "Data Sync",          agent: "System",   ticker: "—",     detail: "Polygon.io · 1,240 instruments" },
  { ts: "2026-04-05 09:09:33", status: "pending"  as const, type: "Approval Request",   agent: "Alpha-1",  ticker: "NVDA",  detail: "50sh long position · $5,920" },
  { ts: "2026-04-05 09:05:17", status: "success"  as const, type: "Agent Started",      agent: "Gamma-3",  ticker: "—",     detail: "Macro Sector Rotation v3.0" },
  { ts: "2026-04-05 09:00:00", status: "success"  as const, type: "Session Opened",     agent: "System",   ticker: "—",     detail: "Market open · All agents nominal" },
];

const TH: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 10, fontWeight: 600,
  color: "var(--db-ink-faint)",
  fontFamily: MONO,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--db-border)",
  whiteSpace: "nowrap",
};

export default function LogPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: "0 0 4px", fontFamily: SANS }}>
          Agent Activity Log
        </h1>
        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SANS }}>
          {ROWS.length} events today · Real-time feed
        </p>
      </div>

      {/* Table */}
      <div style={{
        background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
        borderRadius: 6, overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--db-bg3)" }}>
              <th style={TH}>Timestamp</th>
              <th style={TH}>Status</th>
              <th style={TH}>Action Type</th>
              <th style={TH}>Agent</th>
              <th style={TH}>Ticker</th>
              <th style={{ ...TH, width: "100%" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < ROWS.length - 1 ? "1px solid var(--db-border)" : "none", transition: "background 0.15s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--db-blue-glow)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, whiteSpace: "nowrap" }}>{r.ts}</td>
                <td style={{ padding: "11px 14px" }}><StatusPill status={r.status} /></td>
                <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 400, color: "var(--db-ink)", fontFamily: SANS, whiteSpace: "nowrap" }}>{r.type}</td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{
                    fontSize: 11, fontFamily: MONO, fontWeight: 600,
                    color: r.agent === "System" ? "var(--db-ink-muted)" : "var(--db-blue)",
                    background: r.agent === "System" ? "var(--db-bg4)" : "var(--db-blue-dim)",
                    padding: "2px 7px", borderRadius: 999,
                  }}>{r.agent}</span>
                </td>
                <td style={{ padding: "11px 14px", fontSize: 12, color: "var(--db-ink-muted)", fontFamily: MONO }}>{r.ticker}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", fontFamily: SANS }}>{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
