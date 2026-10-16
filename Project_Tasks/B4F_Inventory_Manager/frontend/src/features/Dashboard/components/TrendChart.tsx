import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../utils";
import type { TrendPoint } from "../types";

const TrendChart = ({ trendData }: { trendData: TrendPoint[] }) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Inventory Movement
          </h2>
          <p className="text-xs text-slate-500">
            Inbound and outbound over the last 7 days
          </p>
        </div>
        <div className="hidden items-center gap-3 text-xs sm:flex">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS.in }}
            />
            Inbound
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS.out }}
            />
            Outbound
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.in} stopOpacity={0.35} />
                <stop offset="95%" stopColor={COLORS.in} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.out} stopOpacity={0.35} />
                <stop offset="95%" stopColor={COLORS.out} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #334155",
                background: "#1e293b",
                color: "#e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                fontSize: 13,
              }}
              labelStyle={{ fontWeight: 600, color: "#cbd5e1" }}
            />
            <Area
              type="monotone"
              dataKey="Inbound"
              stroke={COLORS.in}
              strokeWidth={2.5}
              fill="url(#gradIn)"
              dot={{ r: 3, fill: COLORS.in }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="Outbound"
              stroke={COLORS.out}
              strokeWidth={2.5}
              fill="url(#gradOut)"
              dot={{ r: 3, fill: COLORS.out }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
