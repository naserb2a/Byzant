"use client";
import StatCard from "@/components/dashboard/StatCard";
import LineChart from "@/components/dashboard/LineChart";

const MONO = "inherit";
const SANS = "inherit";

const PERF_PTS   = [92, 88, 95, 91, 97, 94, 100, 98, 105, 102, 108, 106, 112, 110];
const FORECAST   = [110, 115, 112, 118, 122];

const SCENARIOS = [
  { label: "Aggressive", desc: "Max allocation, momentum-following. Higher upside, higher drawdown risk.", ret: "+18.4%", color: "var(--db-blue)" },
  { label: "Conservative", desc: "50% allocation cap, defensive positioning. Lower vol, steady compounding.", ret: "+8.1%", color: "var(--db-green)" },
  { label: "Recession", desc: "Bear-market mode. Cash-heavy, short hedges active. Capital preservation.", ret: "-2.3%", color: "var(--db-amber)" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: "0 0 4px", fontFamily: SANS }}>
            Analytics & Intelligence
          </h1>
          <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SANS }}>
            AI-generated forecasts · Confidence-weighted
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, fontFamily: MONO, fontWeight: 600,
            padding: "4px 10px", borderRadius: 999,
            background: "var(--db-green-dim)", color: "var(--db-green)",
            border: "1px solid rgba(61,214,140,0.25)",
          }}>
            Confidence 94%
          </span>
          <button style={{
            background: "var(--db-blue)", color: "#fff", border: "none",
            borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: SANS,
          }}>
            + New Forecast
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <StatCard label="Win Rate" value="74%" sub="Last 30 trades" accent="green" />
        <StatCard label="Avg R/R" value="2.8x" sub="Risk/reward ratio" accent="blue" />
        <StatCard label="Emotional Trades" value="0" sub="Zero bias detected" accent="green" />
        <StatCard label="Portfolio Return" value="+12.4%" sub="Since inception" accent="green" />
      </div>

      {/* Bottom 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
        {/* Performance chart with forecast */}
        <div style={{
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Performance + AI Forecast</div>
              <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 2 }}>
                Actual · · · Forecast
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--db-ink-muted)" }}>
                <span style={{ color: "var(--db-blue)" }}>—</span> Actual &nbsp;
                <span style={{ color: "var(--db-blue)", opacity: 0.55 }}>- - -</span> Forecast
              </span>
            </div>
          </div>
          <LineChart
            points={PERF_PTS}
            forecast={FORECAST}
            todayIdx={PERF_PTS.length - 1}
            color="var(--db-blue)"
            height={280}
          />
        </div>

        {/* Scenario modeling */}
        <div style={{
          background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
          borderRadius: 6, padding: 20,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Scenario Modeling</div>
          {SCENARIOS.map(s => (
            <div key={s.label} style={{
              background: "var(--db-bg3)",
              border: "1px solid var(--db-border)",
              borderRadius: 6, padding: 14,
              transition: "border-color 0.2s", cursor: "default",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--db-border-mid)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: s.color, fontFamily: MONO }}>{s.ret}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", lineHeight: 1.55, margin: 0, fontFamily: SANS }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
