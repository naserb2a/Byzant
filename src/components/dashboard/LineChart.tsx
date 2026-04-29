"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TooltipContentInput = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: Row }>;
};

type Row = { i: number; v?: number; f?: number; date: number };

const TEAL = "#99E1D9";
const RED = "#ff5a5a";

// Monotone cubic Hermite interpolation (Fritsch–Carlson) — densifies anchors
// into a smooth, non-overshooting curve so the cursor can track every point.
function densify(anchors: number[], target: number): number[] {
  const n = anchors.length;
  if (n < 2) return anchors.slice();

  const slope: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) slope[i] = anchors[i + 1] - anchors[i];

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

  const segCount = Math.max(1, Math.round((target - 1) / (n - 1)));
  const out: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < segCount; j++) {
      const t = j / segCount;
      const h00 = (1 + 2 * t) * (1 - t) * (1 - t);
      const h10 = t * (1 - t) * (1 - t);
      const h01 = t * t * (3 - 2 * t);
      const h11 = t * t * (t - 1);
      out.push(h00 * anchors[i] + h10 * m[i] + h01 * anchors[i + 1] + h11 * m[i + 1]);
    }
  }
  out.push(anchors[n - 1]);
  return out;
}

function fmtUsd(v: number) {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

function fmtSignedUsd(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}$${Math.round(Math.abs(v)).toLocaleString("en-US")}`;
}

function fmtPct(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(2)}%`;
}

export default function LineChart({
  points,
  forecast,
  todayIdx,
  color = "var(--db-blue)",
  height = 160,
}: {
  points: number[];
  forecast?: number[];
  todayIdx?: number;
  color?: string;
  height?: number;
}) {
  const DENSE_TARGET = 208;
  const denseValues =
    points.length >= DENSE_TARGET ? points.slice() : densify(points, DENSE_TARGET);

  // Distribute dense points across the original session span ending today.
  const today = new Date();
  today.setHours(16, 0, 0, 0);
  const sessionMs = 24 * 60 * 60 * 1000;
  const totalSessions = Math.max(1, points.length - 1);

  const data: Row[] = denseValues.map((v, i) => {
    const sessionPos = (i / (denseValues.length - 1)) * totalSessions;
    const sessionsAgo = totalSessions - sessionPos;
    const date = today.getTime() - sessionsAgo * sessionMs;
    return { i, v, date };
  });

  if (forecast && forecast.length > 0) {
    const lastV = denseValues[denseValues.length - 1];
    const startI = denseValues.length - 1;
    data[startI] = { ...data[startI], f: lastV };
    forecast.forEach((fv, j) => {
      const date = today.getTime() + (j + 1) * sessionMs;
      data.push({ i: startI + j + 1, f: fv, date });
    });
  }

  const startVal = denseValues[0];
  const gradId = `lineGrad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--db-border)" strokeDasharray="0" vertical={false} />
        <XAxis dataKey="i" hide />
        <YAxis
          width={56}
          tick={{ fill: "var(--db-ink-faint)", fontSize: 10, fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
          domain={["dataMin", "dataMax"]}
          tickFormatter={(v) => fmtUsd(v)}
        />
        <Tooltip
          cursor={{ stroke: "var(--db-border-hi)", strokeWidth: 1 }}
          isAnimationActive={false}
          animationDuration={0}
          content={(p: TooltipContentInput) => {
            if (!p.active || !p.payload || p.payload.length === 0) return null;
            const row = p.payload[0].payload as Row | undefined;
            if (!row) return null;
            const v = (row.v ?? row.f ?? 0) as number;
            const change = v - startVal;
            const pct = startVal === 0 ? 0 : (change / startVal) * 100;
            const positive = change >= 0;
            const changeColor = positive ? TEAL : RED;
            const dateStr = new Date(row.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                style={{
                  background: "var(--db-bg2)",
                  border: "0.5px solid var(--db-border)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontFamily: "inherit",
                  color: "var(--db-ink)",
                  minWidth: 140,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--db-ink)", lineHeight: 1.2 }}>
                  {fmtUsd(v)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: changeColor, lineHeight: 1.2 }}>
                  {`${fmtSignedUsd(change)} · ${fmtPct(pct)}`}
                </div>
                <div style={{ fontSize: 11, color: "var(--db-ink-muted)", lineHeight: 1.2 }}>
                  {dateStr}
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#${gradId})`}
          isAnimationActive
          connectNulls
        />
        {forecast && forecast.length > 0 && (
          <Line
            type="monotone"
            dataKey="f"
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            strokeOpacity={0.55}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        )}
        {todayIdx !== undefined && (
          <ReferenceLine
            x={todayIdx}
            stroke="var(--db-amber)"
            strokeDasharray="3 2"
            strokeWidth={1}
            label={{
              value: "TODAY",
              position: "insideTopRight",
              fill: "var(--db-amber)",
              fontSize: 9,
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
