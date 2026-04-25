"use client";
interface ModuleCardProps {
  name: string;
  badge: string;
  desc: string;
  price: string;
  installed: boolean;
}

export default function ModuleCard({ name, badge, desc, price, installed }: ModuleCardProps) {
  return (
    <div style={{
      background: installed ? "var(--db-bg3)" : "var(--db-bg2)",
      border: `0.5px solid ${installed ? "var(--db-border-mid)" : "var(--db-border)"}`,
      borderRadius: 6,
      padding: 20,
      display: "flex", flexDirection: "column", gap: 16,
      transition: "border-color 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = installed ? "var(--db-border-mid)" : "var(--db-border)")}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "var(--db-blue)", background: "var(--db-blue-dim)",
          border: "1px solid var(--db-border-mid)",
          padding: "2px 8px", borderRadius: 999,
        }}>{badge}</span>
        <span style={{
          fontSize: 11, color: "var(--db-ink-muted)",
        }}>{price}</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--db-ink)", marginBottom: 6, letterSpacing: "-0.01em" }}>{name}</div>
        <p style={{ fontSize: 13, color: "var(--db-ink-muted)", lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>

      {installed ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px 0", borderRadius: 6,
          background: "var(--db-green-dim)", border: "1px solid rgba(61,214,140,0.2)",
          fontSize: 12, fontWeight: 500, color: "var(--db-green)",
        }}>
          ✓ Installed
        </div>
      ) : (
        <button style={{
          width: "100%", background: "var(--db-blue)", color: "#0a0a0a",
          border: "none", borderRadius: 6, padding: "8px 0",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Get Module
        </button>
      )}
    </div>
  );
}
