import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { DashboardStats, RatioPoint } from "../types"
import { nf, PIE_COLORS } from "../utils"

const InOutBoundRatioChart = ({ stats, ratio }: { stats: DashboardStats, ratio:  RatioPoint[]}) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700">
                <h2 className="text-base font-semibold text-slate-100">
                  Inbound vs Outbound Ratio
                </h2>
                <p className="text-xs text-slate-500">Total recorded movements</p>
    
                <div className="mt-2 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratio}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {ratio.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
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
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(v) => (
                          <span className="text-sm text-slate-300">{v}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
    
                <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-700 pt-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Net Movement</p>
                    <p
                      className={`text-lg font-bold ${
                        stats.net >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stats.net >= 0 ? "+" : ""}
                      {nf.format(stats.net)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Total Movements</p>
                    <p className="text-lg font-bold text-slate-200">
                      {nf.format(stats.movementsCount)}
                    </p>
                  </div>
                </div>
              </div>
  )
}

export default InOutBoundRatioChart