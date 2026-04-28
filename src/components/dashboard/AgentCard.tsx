"use client";
import ScoreRing from "./ScoreRing";
import MiniBarChart from "./MiniBarChart";
import StatusPill from "./StatusPill";

type AgentStatus = "active" | "paused" | "pending";

interface AgentCardProps {
  id: string;
  name: string;
  category: string;
  score: number;
  signal: string;
  position: string;
  rr: string;
  status: AgentStatus;
  statusLabel?: string;
  bars: number[];
  accentColor?: string;
}

export default function AgentCard({
  id, name, category, score, signal, position, rr, status, statusLabel, bars, accentColor,
}: AgentCardProps) {
  const scoreColor = score >= 80 ? "var(--db-green)" : score >= 55 ? "var(--db-amber)" : "var(--db-red)";
  const ac = accentColor ?? scoreColor;

  return (
    <div style={{
      background: "var(--db-bg2)",
      border: "0.5px solid var(--db-border)",
      borderRadius: 6,
      padding: 20,
      display: "flex", flexDirection: "column", gap: 16,
      transition: "border-color 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `rgba(${ac === "var(--db-green)" ? "61,214,140" : ac === "var(--db-amber)" ? "240,180,41" : "77,159,255"},0.12)`,
            border: `1px solid ${ac === "var(--db-green)" ? "rgba(61,214,140,0.25)" : ac === "var(--db-amber)" ? "rgba(240,180,41,0.25)" : "var(--db-border-mid)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill={ac} fillOpacity={0.8} />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill={ac} fillOpacity={0.4} />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill={ac} fillOpacity={0.4} />
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill={ac} fillOpacity={0.65} />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--db-ink)", letterSpacing: "-0.01em", fontFamily: "inherit" }}>{name}</div>
            <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: "inherit", marginTop: 1 }}>{id} · {category}</div>
          </div>
        </div>
        <ScoreRing score={score} size={52} />
      </div>

      {/* Data rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { l: "Signal", v: signal, vc: signal.toLowerCase().includes("bull") ? "var(--db-green)" : signal.toLowerCase().includes("bear") ? "var(--db-red)" : "var(--db-ink)" },
          { l: "Position", v: position, vc: "var(--db-ink)" },
          { l: "R/R", v: rr, vc: "var(--db-blue)" },
        ].map((r, i) => (
          <div key={r.l} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "7px 0",
            borderBottom: i < 2 ? "1px solid var(--db-border)" : "none",
          }}>
            <span style={{ fontSize: 10, color: "var(--db-ink-faint)", fontFamily: "inherit", letterSpacing: "0.06em", textTransform: "uppercase" }}>{r.l}</span>
            <span style={{ fontSize: 12, fontWeight: 400, color: r.vc, fontFamily: "inherit" }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div style={{ height: 36 }}>
        <MiniBarChart bars={bars} activeColor={scoreColor} />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <StatusPill status={status} label={statusLabel} />
        <span style={{ fontSize: 11, color: "var(--db-blue)", cursor: "pointer", fontFamily: "inherit", fontWeight: 400 }}>View full analysis →</span>
      </div>
    </div>
  );
}
