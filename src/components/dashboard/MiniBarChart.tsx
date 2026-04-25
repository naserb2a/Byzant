"use client";

import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";

export default function MiniBarChart({
  bars,
  activeColor = "var(--db-blue)",
  inactiveColor = "var(--db-bg4)",
  height = 36,
}: {
  bars: number[];
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
}) {
  const data = bars.map((v, i) => ({ i, v }));
  const activeFrom = bars.length - 3;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        barCategoryGap={2}
      >
        <Bar dataKey="v" radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={i >= activeFrom ? activeColor : inactiveColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
