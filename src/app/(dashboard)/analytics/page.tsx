"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";

const SANS = "inherit";
const TEAL = "#99E1D9";

type RangeKey = "1W" | "1M" | "3M" | "6M" | "1Y" | "All";
type Point = { date: Date; value: number };

const RANGES: { key: RangeKey; days: number; granularity: "day" | "week" | "month" }[] = [
  { key: "1W",  days: 7,    granularity: "day"   },
  { key: "1M",  days: 30,   granularity: "day"   },
  { key: "3M",  days: 90,   granularity: "week"  },
  { key: "6M",  days: 182,  granularity: "week"  },
  { key: "1Y",  days: 365,  granularity: "month" },
  { key: "All", days: 730,  granularity: "month" },
];

const NOW = new Date(2026, 3, 25); // April 25, 2026 — fixed anchor for deterministic data
const LATEST_VALUE = 11840;

function buildSeries(days: number, granularity: "day" | "week" | "month"): Point[] {
  const stepMs =
    granularity === "day" ? 86400000 :
    granularity === "week" ? 7 * 86400000 :
    30 * 86400000;
  const count =
    granularity === "day" ? days :
    granularity === "week" ? Math.max(8, Math.round(days / 7)) :
    Math.max(8, Math.round(days / 30));

  // Start values are tuned so the visible trend looks plausible at each window
  const startMap: Record<string, number> = {
    "7|day":   11420,
    "30|day":  10780,
    "90|week": 10410,
    "182|week":  9920,
    "365|month": 9400,
    "730|month": 8200,
  };
  const startVal = startMap[`${days}|${granularity}`] ?? 10000;

  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const trend = startVal + (LATEST_VALUE - startVal) * t;
    // deterministic wobble
    const w =
      Math.sin(i * 0.62 + days * 0.011) * 0.012 * trend +
      Math.cos(i * 0.31 + days * 0.027) * 0.008 * trend +
      Math.sin(i * 1.13) * 0.005 * trend;
    const date = new Date(NOW.getTime() - (count - 1 - i) * stepMs);
    pts.push({ date, value: Math.round(trend + w) });
  }
  pts[0].value = startVal;
  pts[pts.length - 1].value = LATEST_VALUE;
  return pts;
}

const SERIES: Record<RangeKey, Point[]> = RANGES.reduce(
  (acc, r) => {
    acc[r.key] = buildSeries(r.days, r.granularity);
    return acc;
  },
  {} as Record<RangeKey, Point[]>
);

function fmtUsd(v: number) {
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function fmtSignedUsd(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function fmtPct(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(2)}%`;
}

function fmtDate(d: Date, granularity: "day" | "week" | "month") {
  if (granularity === "month") {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function RangePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 999,
        border: "0.5px solid",
        borderColor: active ? "rgba(153,225,217,0.45)" : "var(--db-border)",
        background: active ? "rgba(153,225,217,0.12)" : "transparent",
        color: active ? TEAL : "var(--db-ink-muted)",
        fontSize: 11,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        fontFamily: SANS,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--db-border-hi)";
          e.currentTarget.style.color = "var(--db-ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--db-border)";
          e.currentTarget.style.color = "var(--db-ink-muted)";
        }
      }}
    >
      {label}
    </button>
  );
}

function InteractiveChart({
  data,
  height,
  hoveredIdx,
  onHover,
  lineColor,
}: {
  data: Point[];
  height: number;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
  lineColor: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const gradId = useMemo(() => `pf-grad-${Math.random().toString(36).slice(2, 8)}`, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.max(0, Math.floor(w)));
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const padL = 8, padR = 8, padT = 14, padB = 22;

  if (width <= 0 || data.length < 2) {
    return <div ref={wrapRef} style={{ height, width: "100%" }} />;
  }

  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const yPad = range * 0.08;

  const xAt = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yAt = (v: number) => padT + (1 - (v - (min - yPad)) / (range + yPad * 2)) * chartH;

  const linePoints = data.map((d, i) => `${xAt(i).toFixed(2)},${yAt(d.value).toFixed(2)}`).join(" ");
  const areaPath =
    `M ${xAt(0).toFixed(2)} ${(padT + chartH).toFixed(2)} ` +
    data.map((d, i) => `L ${xAt(i).toFixed(2)} ${yAt(d.value).toFixed(2)}`).join(" ") +
    ` L ${xAt(data.length - 1).toFixed(2)} ${(padT + chartH).toFixed(2)} Z`;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = (x - padL) / chartW;
    const idx = Math.round(ratio * (data.length - 1));
    onHover(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const showCursor = hoveredIdx !== null && hoveredIdx >= 0 && hoveredIdx < data.length;
  const cursorX = showCursor ? xAt(hoveredIdx!) : 0;
  const cursorY = showCursor ? yAt(data[hoveredIdx!].value) : 0;

  return (
    <div ref={wrapRef} style={{ height, width: "100%" }}>
      <svg
        width={width}
        height={height}
        onMouseMove={handleMove}
        onMouseLeave={() => onHover(null)}
        style={{ display: "block", cursor: "crosshair" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.22} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {showCursor && (
          <>
            <line
              x1={cursorX}
              y1={padT}
              x2={cursorX}
              y2={padT + chartH}
              stroke={TEAL}
              strokeDasharray="3 3"
              strokeWidth={1}
              opacity={0.7}
            />
            <circle
              cx={cursorX}
              cy={cursorY}
              r={5}
              fill={TEAL}
              stroke="var(--db-bg2)"
              strokeWidth={2}
            />
          </>
        )}
      </svg>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("1M");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = SERIES[range];
  const granularity = RANGES.find((r) => r.key === range)!.granularity;
  const latestIdx = data.length - 1;
  const activeIdx = hoveredIdx ?? latestIdx;
  const activePoint = data[activeIdx];
  const startValue = data[0].value;

  const change = activePoint.value - startValue;
  const pct = (change / startValue) * 100;
  const isPositive = change >= 0;
  const changeColor = isPositive ? "var(--db-green)" : "var(--db-red)";
  const lineColor = data[latestIdx].value >= startValue ? "var(--db-green)" : "var(--db-red)";

  const totalPnl = 1840;
  const totalPnlPositive = totalPnl >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--db-ink)",
            letterSpacing: "-0.02em",
            margin: "0 0 4px",
            fontFamily: SANS,
          }}
        >
          Analytics & Intelligence
        </h1>
        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SANS }}>
          AI-generated forecasts · Confidence-weighted
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        <StatCard label="Win Rate" value="74%" sub="Last 30 trades" accent="green" />
        <StatCard label="Avg R/R" value="2.8x" sub="Risk/reward ratio" accent="blue" />
        <StatCard label="Emotional Trades" value="0" sub="Zero bias detected" accent="green" />
        <StatCard label="Portfolio Return" value="+12.4%" sub="Since inception" accent="green" />
        <StatCard
          label="Total P&L"
          value={fmtSignedUsd(totalPnl)}
          sub="Since inception"
          accent={totalPnlPositive ? "green" : "red"}
        />
      </div>

      {/* Performance chart — full width */}
      <div
        style={{
          background: "var(--db-bg2)",
          border: "0.5px solid var(--db-border)",
          borderRadius: 6,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Top: dynamic readout (left) + range selector (right) */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--db-ink-muted)",
                fontFamily: SANS,
              }}
            >
              Portfolio Value
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--db-ink)",
                fontFamily: SANS,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {fmtUsd(activePoint.value)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12,
                fontFamily: SANS,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: changeColor, fontWeight: 600 }}>
                {fmtSignedUsd(change)} · {fmtPct(pct)}
              </span>
              <span style={{ color: "var(--db-ink-muted)" }}>
                {fmtDate(activePoint.date, granularity)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {RANGES.map((r) => (
              <RangePill
                key={r.key}
                label={r.key}
                active={range === r.key}
                onClick={() => {
                  setRange(r.key);
                  setHoveredIdx(null);
                }}
              />
            ))}
          </div>
        </div>

        {/* Chart */}
        <InteractiveChart
          data={data}
          height={340}
          hoveredIdx={hoveredIdx}
          onHover={setHoveredIdx}
          lineColor={lineColor}
        />
      </div>
    </div>
  );
}
