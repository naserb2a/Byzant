export default function InsightBubble({
  label,
  text,
  accent = "blue",
}: {
  label: string;
  text: string;
  accent?: "blue" | "green" | "amber";
}) {
  const colors: Record<string, { border: string; label: string }> = {
    blue:  { border: "var(--db-border-mid)", label: "var(--db-blue)"  },
    green: { border: "rgba(61,214,140,0.2)", label: "var(--db-green)" },
    amber: { border: "rgba(240,180,41,0.2)", label: "var(--db-amber)" },
  };
  const c = colors[accent];
  return (
    <div style={{
      background: "var(--db-bg3)",
      border: `1px solid ${c.border}`,
      borderRadius: 6,
      padding: "14px 16px",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
        textTransform: "uppercase", color: c.label,
        marginBottom: 6,
      }}>
        {label}
      </div>
      <p style={{ fontSize: 13, color: "var(--db-ink-muted)", lineHeight: 1.5, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}
