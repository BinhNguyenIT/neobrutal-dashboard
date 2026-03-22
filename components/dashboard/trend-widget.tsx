"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { widgetChartTheme } from "@/lib/theme";
import { TrendPoint } from "@/lib/types";

export function TrendWidget({ data }: { data: TrendPoint[] }) {
  return (
    <section className="rounded-brutal border-4 border-line bg-panel p-5 text-ink shadow-brutal">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/60">Trend View</p>
          <h2 className="mt-2 text-2xl font-black">Revenue vs quality</h2>
        </div>
        <div className="rounded-2xl border-2 border-line bg-panel-muted px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]">
          Mocked live feed
        </div>
      </div>
      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#1a1a1a" strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#252525" />
            <YAxis tickLine={false} axisLine={false} stroke="#252525" />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "3px solid #101010",
                boxShadow: "4px 4px 0 #000",
                backgroundColor: "#f4efe2",
                color: "#101010",
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke={widgetChartTheme.revenue} strokeWidth={4} dot={{ r: 0 }} />
            <Line type="monotone" dataKey="conversionRate" stroke={widgetChartTheme.conversionRate} strokeWidth={3} dot={{ r: 0 }} />
            <Line type="monotone" dataKey="qualityScore" stroke={widgetChartTheme.qualityScore} strokeWidth={3} dot={{ r: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
