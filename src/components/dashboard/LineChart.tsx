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

type Row = { i: number; v?: number; f?: number };

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
  const data: Row[] = points.map((v, i) => ({ i, v }));
  if (forecast && forecast.length > 0) {
    const lastV = points[points.length - 1];
    const startI = points.length - 1;
    data[startI] = { ...data[startI], f: lastV };
    forecast.forEach((fv, j) => {
      data.push({ i: startI + j + 1, f: fv });
    });
  }

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
        <CartesianGrid
          stroke="var(--db-border)"
          strokeDasharray="0"
          vertical={false}
        />
        <XAxis
          dataKey="i"
          hide
        />
        <YAxis
          width={36}
          tick={{
            fill: "var(--db-ink-faint)",
            fontSize: 10,
            fontFamily: "inherit",
          }}
          axisLine={false}
          tickLine={false}
          domain={["dataMin", "dataMax"]}
        />
        <Tooltip
          cursor={{ stroke: "var(--db-border-hi)", strokeWidth: 1 }}
          contentStyle={{
            background: "var(--db-bg2)",
            border: "0.5px solid var(--db-border-hi)",
            borderRadius: 6,
            fontSize: 12,
            padding: "6px 10px",
            fontFamily: "inherit",
            color: "var(--db-ink)",
          }}
          labelStyle={{ display: "none" }}
          formatter={(value) => [
            typeof value === "number" ? value.toFixed(2) : String(value),
            "",
          ]}
          separator=""
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
