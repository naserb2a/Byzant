"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";

const SANS = "inherit";
const TEAL = "#99E1D9";

type RangeKey = "1W" | "1M" | "3M" | "6M" | "1Y" | "All";
type Granularity = "hour" | "day" | "week";
type Point = { date: Date; value: number };

const HOUR_MS = 3600 * 1000;
const DAY_MS = 86400000;

const RANGES: {
  key: RangeKey;
  count: number;
  stepMs: number;
  granularity: Granularity;
  startVal: number;
}[] = [
  { key: "1W",  count: 35,  stepMs: HOUR_MS,     granularity: "hour", startVal: 11420 },
  { key: "1M",  count: 22,  stepMs: DAY_MS,      granularity: "day",  startVal: 10780 },
  { key: "3M",  count: 66,  stepMs: DAY_MS,      granularity: "day",  startVal: 10410 },
  { key: "6M",  count: 132, stepMs: DAY_MS,      granularity: "day",  startVal: 9920  },
  { key: "1Y",  count: 252, stepMs: DAY_MS,      granularity: "day",  startVal: 9400  },
  { key: "All", count: 104, stepMs: 7 * DAY_MS,  granularity: "week", startVal: 8200  },
];

const NOW = new Date(2026, 3, 25); // April 25, 2026 — fixed anchor for deterministic data
const LATEST_VALUE = 11840;

function buildSeries(count: number, stepMs: number, startVal: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const trend = startVal + (LATEST_VALUE - startVal) * t;
    // deterministic multi-frequency wobble for plausible micro-movement
    const w =
      Math.sin(i * 0.62 + count * 0.011) * 0.012 * trend +
      Math.cos(i * 0.31 + count * 0.027) * 0.008 * trend +
      Math.sin(i * 1.13) * 0.005 * trend +
      Math.cos(i * 2.07) * 0.003 * trend;
    const date = new Date(NOW.getTime() - (count - 1 - i) * stepMs);
    pts.push({ date, value: Math.round(trend + w) });
  }
  pts[0].value = startVal;
  pts[pts.length - 1].value = LATEST_VALUE;
  return pts;
}

// Monotone cubic Hermite interpolation (Fritsch–Carlson) — densifies a sparse
// anchor series into a smooth, non-overshooting curve so the cursor can land on
// every point in between. Dates are spaced linearly across the original span.
function densifyPoints(anchors: Point[], target: number): Point[] {
  const n = anchors.length;
  if (n < 2 || target <= n) return anchors.slice();

  const xs = anchors.map((a) => a.date.getTime());
  const ys = anchors.map((a) => a.value);

  const dx: number[] = new Array(n - 1);
  const slope: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i];
    slope[i] = (ys[i + 1] - ys[i]) / dx[i];
  }
  const m: number[] = new Array(n);
  m[0] = slope[0];
  m[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / slope[i];
      const b = m[i + 1] / slope[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        m[i] = tau * a * slope[i];
        m[i + 1] = tau * b * slope[i];
      }
    }
  }

  const out: Point[] = [];
  const xMin = xs[0];
  const xMax = xs[n - 1];
  for (let k = 0; k < target; k++) {
    const t = k / (target - 1);
    const x = xMin + t * (xMax - xMin);
    let i = 0;
    while (i < n - 2 && xs[i + 1] < x) i++;
    const localT = dx[i] === 0 ? 0 : (x - xs[i]) / dx[i];
    const h00 = (1 + 2 * localT) * (1 - localT) * (1 - localT);
    const h10 = localT * (1 - localT) * (1 - localT);
    const h01 = localT * localT * (3 - 2 * localT);
    const h11 = localT * localT * (localT - 1);
    const v =
      h00 * ys[i] +
      h10 * dx[i] * m[i] +
      h01 * ys[i + 1] +
      h11 * dx[i] * m[i + 1];
    out.push({ date: new Date(x), value: Math.round(v) });
  }
  out[0] = { date: anchors[0].date, value: anchors[0].value };
  out[out.length - 1] = { date: anchors[n - 1].date, value: anchors[n - 1].value };
  return out;
}

const DENSE_TARGET = 208;

const SERIES: Record<RangeKey, Point[]> = RANGES.reduce(
  (acc, r) => {
    const anchors = buildSeries(r.count, r.stepMs, r.startVal);
    acc[r.key] = anchors.length >= DENSE_TARGET ? anchors : densifyPoints(anchors, DENSE_TARGET);
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

function niceTicks(min: number, max: number, count = 5): number[] {
  const range = max - min;
  if (range <= 0) return [min];
  const rough = range / (count - 1);
  const exp = Math.floor(Math.log10(rough));
  const f = rough / Math.pow(10, exp);
  let nice: number;
  if (f < 1.5) nice = 1;
  else if (f < 3) nice = 2;
  else if (f < 7) nice = 5;
  else nice = 10;
  const step = nice * Math.pow(10, exp);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + 0.5 * step; v += step) {
    ticks.push(Math.round(v));
  }
  return ticks;
}

function fmtDate(d: Date, granularity: Granularity) {
  if (granularity === "hour") {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
  granularity,
}: {
  data: Point[];
  height: number;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
  lineColor: string;
  granularity: Granularity;
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

  const padL = 56, padR = 8, padT = 14, padB = 22;

  if (width <= 0 || data.length < 2) {
    return <div ref={wrapRef} style={{ height, width: "100%", position: "relative" }} />;
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

  const yMin = min - yPad;
  const yMax = max + yPad;
  const yTicks = niceTicks(yMin, yMax, 5).filter((t) => t >= yMin && t <= yMax);

  const n = data.length;
  const xs = data.map((_, i) => xAt(i));
  const ys = data.map((d) => yAt(d.value));

  // Monotone cubic Hermite (Fritsch–Carlson) tangents — prevents overshoot.
  const dxArr: number[] = new Array(n - 1);
  const slope: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    dxArr[i] = xs[i + 1] - xs[i];
    slope[i] = (ys[i + 1] - ys[i]) / dxArr[i];
  }
  const m: number[] = new Array(n);
  m[0] = slope[0];
  m[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / slope[i];
      const b = m[i + 1] / slope[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        m[i] = tau * a * slope[i];
        m[i + 1] = tau * b * slope[i];
      }
    }
  }
  const segments: string[] = [];
  for (let i = 0; i < n - 1; i++) {
    const cp1x = xs[i] + dxArr[i] / 3;
    const cp1y = ys[i] + (m[i] * dxArr[i]) / 3;
    const cp2x = xs[i + 1] - dxArr[i] / 3;
    const cp2y = ys[i + 1] - (m[i + 1] * dxArr[i]) / 3;
    segments.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xs[i + 1].toFixed(2)} ${ys[i + 1].toFixed(2)}`
    );
  }
  const baseY = padT + chartH;
  const linePath = `M ${xs[0].toFixed(2)} ${ys[0].toFixed(2)} ${segments.join(" ")}`;
  const areaPath =
    `M ${xs[0].toFixed(2)} ${baseY.toFixed(2)} ` +
    `L ${xs[0].toFixed(2)} ${ys[0].toFixed(2)} ` +
    `${segments.join(" ")} ` +
    `L ${xs[n - 1].toFixed(2)} ${baseY.toFixed(2)} Z`;

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

  // Near-cursor tooltip — content + edge-aware horizontal positioning.
  const startVal = data[0].value;
  const activePoint = showCursor ? data[hoveredIdx!] : null;
  const change = activePoint ? activePoint.value - startVal : 0;
  const pct = activePoint && startVal !== 0 ? (change / startVal) * 100 : 0;
  const positive = change >= 0;
  const changeColor = positive ? TEAL : "#ff5a5a";

  const TIP_W = 168;
  const TIP_OFFSET = 14;
  let tipLeft = 0;
  if (showCursor) {
    tipLeft =
      cursorX + TIP_OFFSET + TIP_W <= width
        ? cursorX + TIP_OFFSET
        : Math.max(0, cursorX - TIP_OFFSET - TIP_W);
  }
  const tipTop = Math.max(8, Math.min(cursorY - 30, height - 78));

  return (
    <div ref={wrapRef} style={{ height, width: "100%", position: "relative" }}>
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
        {yTicks.map((t, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={padL}
              x2={padL + chartW}
              y1={yAt(t)}
              y2={yAt(t)}
              stroke="var(--db-grid)"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={yAt(t)}
              fill="var(--db-ink-faint)"
              fontSize={10}
              fontFamily="inherit"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {fmtUsd(t)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath}
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
      {activePoint && (
        <div
          style={{
            position: "absolute",
            left: tipLeft,
            top: tipTop,
            width: TIP_W,
            background: "var(--db-bg2)",
            border: "0.5px solid var(--db-border)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            borderRadius: 8,
            padding: "8px 10px",
            fontFamily: SANS,
            color: "var(--db-ink)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontVariantNumeric: "tabular-nums",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--db-ink)", lineHeight: 1.2 }}>
            {fmtUsd(activePoint.value)}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: changeColor, lineHeight: 1.2 }}>
            {`${fmtSignedUsd(change)} · ${fmtPct(pct)}`}
          </div>
          <div style={{ fontSize: 11, color: "var(--db-ink-muted)", lineHeight: 1.2 }}>
            {fmtDate(activePoint.date, granularity)}
          </div>
        </div>
      )}
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
            margin: 0,
            fontFamily: SANS,
          }}
        >
          Analytics & Intelligence
        </h1>
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
          granularity={granularity}
        />
      </div>
    </div>
  );
}
