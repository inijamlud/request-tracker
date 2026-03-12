"use client";

// app/dashboard/StatusChart.tsx
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { status: string; count: number }[];
};

const BAR_COLORS: Record<string, string> = {
  PENDING: "#BFCC94",
  SUBMITTED: "#ED7D3A",
  DONE: "#93032E",
};

export default function StatusChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={40}>
        <XAxis
          dataKey="status"
          tick={{ fill: "#00272B", fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#00272B99", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#BFCC9420" }}
          contentStyle={{
            background: "white",
            border: "1px solid #BFCC94",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={BAR_COLORS[entry.status] ?? "#ccc"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
