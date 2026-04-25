"use client";
import StatCard from "@/components/dashboard/StatCard";
import RoadmapCard from "@/components/dashboard/RoadmapCard";

const MONO = "inherit";
const SANS = "inherit";

const PHASES = [
  {
    phase: "Phase 1", title: "Foundation",
    status: "done" as const, pct: 100,
    items: [
      { label: "Landing page & waitlist", done: true },
      { label: "Supabase auth + DB", done: true },
      { label: "Core design system", done: true },
      { label: "Marketplace scaffold", done: true },
    ],
  },
  {
    phase: "Phase 2", title: "Marketplace",
    status: "active" as const, pct: 65,
    items: [
      { label: "MCP server integration", done: true },
      { label: "Module subscription flow", done: true },
      { label: "Agent dashboard", done: false },
      { label: "Stripe payments", done: false },
    ],
  },
  {
    phase: "Phase 3", title: "Ecosystem",
    status: "planned" as const, pct: 0,
    items: [
      { label: "Agent-to-agent comms", done: false },
      { label: "Strategy marketplace", done: false },
      { label: "Partner API program", done: false },
      { label: "Mobile companion app", done: false },
    ],
  },
];

// SVG Timeline
function RoadmapTimeline() {
  const W = 600;
  const H = 72;
  const points = [
    { x: 40,  label: "Q4 2023", sub: "Founded",      done: true,   active: false },
    { x: 160, label: "Phase 1",  sub: "Foundation",  done: true,   active: false },
    { x: 300, label: "NOW",      sub: "Phase 2",     done: false,  active: true  },
    { x: 440, label: "Phase 3",  sub: "Ecosystem",   done: false,  active: false },
    { x: 560, label: "Q3 2026",  sub: "Scale",       done: false,  active: false },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {/* Track */}
      <line x1={40} y1={32} x2={560} y2={32} stroke="var(--db-border-mid)" strokeWidth={1.5} />

      {points.map((p, i) => {
        const color = p.active ? "var(--db-blue)" : p.done ? "var(--db-green)" : "var(--db-ink-faint)";
        return (
          <g key={i}>
            {/* Connector fill */}
            {i > 0 && (points[i - 1].done || points[i - 1].active) && (
              <line
                x1={points[i - 1].x} y1={32} x2={p.done || p.active ? p.x : points[i - 1].x + 20} y2={32}
                stroke="var(--db-green)" strokeWidth={1.5}
              />
            )}
            {/* Node */}
            <circle cx={p.x} cy={32} r={p.active ? 9 : 7}
              fill={p.active ? "var(--db-blue-dim)" : p.done ? "var(--db-green-dim)" : "var(--db-bg4)"}
              stroke={color} strokeWidth={p.active ? 2 : 1.5}
              style={p.active ? { animation: "db-ring-pulse 2s infinite" } : undefined}
            />
            {p.done && (
              <text x={p.x} y={32} textAnchor="middle" dominantBaseline="central"
                fontSize={8} fill="var(--db-green)" fontFamily={MONO}>✓</text>
            )}
            {p.active && (
              <circle cx={p.x} cy={32} r={4} fill="var(--db-blue)" />
            )}
            {/* Labels */}
            <text x={p.x} y={52} textAnchor="middle" fontSize={9} fontWeight={p.active ? 700 : 500}
              fill={color} fontFamily={MONO}>{p.label}</text>
            <text x={p.x} y={63} textAnchor="middle" fontSize={8}
              fill="var(--db-ink-faint)" fontFamily={MONO}>{p.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function RoadmapPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--db-ink)", letterSpacing: "-0.025em", margin: "0 0 4px", fontFamily: SANS }}>
          Product Roadmap
        </h1>
        <p style={{ fontSize: 13, color: "var(--db-ink-muted)", margin: 0, fontFamily: MONO }}>
          Building the infrastructure layer for agentic trading
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <StatCard label="Phase Progress" value="68%" sub="Phase 2 active" accent="blue" />
        <StatCard label="Next Milestone" value="Phase 2" sub="Marketplace launch" accent="green" />
        <StatCard label="Active Phase" value="Phase 2" sub="Marketplace Launch" accent="blue" />
      </div>

      {/* Timeline */}
      <div style={{
        background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
        borderRadius: 6, padding: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--db-ink-muted)", fontFamily: MONO, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Timeline
        </div>
        <RoadmapTimeline />
      </div>

      {/* Phase cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {PHASES.map(p => <RoadmapCard key={p.phase} {...p} />)}
      </div>
    </div>
  );
}
