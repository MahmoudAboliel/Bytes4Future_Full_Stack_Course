import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { COLORS } from "../utils"
import type { TopProduct } from "../types";

const TopProductsChart = ({ topProducts }: { topProducts: TopProduct[] }) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700 lg:col-span-2">
      <h2 className="text-base font-semibold text-slate-100">
        Top Moving Products
      </h2>
      <p className="text-xs text-slate-500">Top 5 products by total quantity</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            barSize={14}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={120}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              orientation="left"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #334155",
                background: "#1e293b",
                color: "#e2e8f0",
                fontSize: 13,
              }}
            />
            <Legend
              iconType="circle"
              formatter={(v) => (
                <span className="text-sm text-slate-300">{v}</span>
              )}
            />
            <Bar dataKey="Inbound" fill={COLORS.in} radius={[6, 6, 6, 6]} />
            <Bar dataKey="Outbound" fill={COLORS.out} radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart