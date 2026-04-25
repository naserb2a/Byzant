"use client";
export default function StatCard({
  label,
  value,
  sub,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "blue" | "green" | "amber" | "red";
}) {
  const colors: Record<string, string> = {
    blue:  "var(--db-blue)",
    green: "var(--db-green)",
    amber: "var(--db-amber)",
    red:   "var(--db-red)",
  };
  const col = colors[accent];
  return (
    <div style={{
      background: "var(--db-bg2)",
      border: "0.5px solid var(--db-border)",
      borderRadius: 6,
      padding: 20,
      display: "flex", flexDirection: "column", gap: 6,
      transition: "border-color 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
    >
      <div style={{
        fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
        textTransform: "uppercase", color: "var(--db-ink-muted)",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
        color: col, fontVariantNumeric: "tabular-nums",
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--db-ink-muted)" }}>{sub}</div>
      )}
    </div>
  );
}
