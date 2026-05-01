"use client";
import ProgressRing from "./ProgressRing";

interface CheckItem {
  label: string;
  done: boolean;
}

interface RoadmapCardProps {
  phase: string;
  title: string;
  status: "done" | "active" | "planned";
  pct: number;
  items: CheckItem[];
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  done:    { bg: "var(--db-green-dim)",  color: "var(--db-green)", label: "Complete" },
  active:  { bg: "var(--db-blue-dim)",   color: "var(--db-accent-text)",  label: "Active"   },
  planned: { bg: "var(--db-bg4)",        color: "var(--db-ink-muted)", label: "Planned" },
};

export default function RoadmapCard({ phase, title, status, pct, items }: RoadmapCardProps) {
  const s = STATUS_STYLES[status];
  const ringColor = status === "done" ? "var(--db-green)" : status === "active" ? "var(--db-blue)" : "var(--db-ink-faint)";
  return (
    <div style={{
      background: "var(--db-bg2)",
      border: `0.5px solid ${status === "active" ? "var(--db-border-mid)" : "var(--db-border)"}`,
      borderRadius: 6, padding: 20,
      display: "flex", flexDirection: "column", gap: 16,
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = status === "active" ? "var(--db-border-mid)" : "var(--db-border)")}
    >
      {/* Phase badge + status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--db-ink-muted)",
          fontFamily: "inherit",
        }}>{phase}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
          background: s.bg, color: s.color,
          fontFamily: "inherit",
        }}>{s.label}</span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--db-ink)", letterSpacing: "-0.02em" }}>{title}</div>

      {/* Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              background: item.done ? "var(--db-green-dim)" : "var(--db-bg4)",
              border: `1px solid ${item.done ? "rgba(61,214,140,0.3)" : "var(--db-border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "var(--db-green)",
            }}>
              {item.done ? "✓" : ""}
            </span>
            <span style={{
              fontSize: 12,
              color: item.done ? "var(--db-ink-muted)" : "var(--db-ink-faint)",
              textDecoration: item.done ? "none" : "none",
            }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Progress ring bottom-right */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ProgressRing pct={pct} size={52} color={ringColor} />
      </div>
    </div>
  );
}
