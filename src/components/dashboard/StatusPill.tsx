const CONFIGS = {
  success: { dot: "var(--db-green)", bg: "var(--db-green-dim)", text: "var(--db-green)",  label: "Success"  },
  pending: { dot: "var(--db-blue)",  bg: "var(--db-blue-dim)",  text: "var(--db-blue)",   label: "Pending"  },
  declined:{ dot: "var(--db-red)",   bg: "var(--db-red-dim)",   text: "var(--db-red)",    label: "Declined" },
  active:  { dot: "var(--db-green)", bg: "var(--db-green-dim)", text: "var(--db-green)",  label: "Active"   },
  paused:  { dot: "var(--db-amber)", bg: "var(--db-amber-dim)", text: "var(--db-amber)",  label: "Paused"   },
} as const;

type Status = keyof typeof CONFIGS;

export default function StatusPill({ status, label }: { status: Status; label?: string }) {
  const c = CONFIGS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 9px", borderRadius: 999,
      background: c.bg, color: c.text,
      fontSize: 11,
      fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }} />
      {label ?? c.label}
    </span>
  );
}
