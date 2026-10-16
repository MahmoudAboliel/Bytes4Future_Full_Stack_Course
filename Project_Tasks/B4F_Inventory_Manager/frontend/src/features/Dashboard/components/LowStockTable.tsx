import type { DashboardStats, LowStockProduct } from "../types";
import { nf } from "../utils";

const LowStockTable = ({
  stats,
  lowStock,
}: {
  stats: DashboardStats;
  lowStock: LowStockProduct[];
}) => {
  return (
    <section className="rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Low Stock Alerts
          </h2>
          <p className="text-xs text-slate-500">
            Products at or below minimum threshold
          </p>
        </div>
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
          {nf.format(stats.lowStockCount)} products
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-3 pl-2 font-medium">Product</th>
              <th className="pb-3 font-medium">Current Qty</th>
              <th className="pb-3 font-medium">Min Qty</th>
              <th className="pb-3 font-medium">Stock Level</th>
              <th className="pb-3 pr-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {lowStock.map((p) => {
              const ratio = Math.min(
                100,
                Math.round((p.quantity / Math.max(p.minimumQuantity, 1)) * 100),
              );
              const critical = p.quantity <= p.minimumQuantity / 2;
              return (
                <tr
                  key={p._id}
                  className="text-sm transition hover:bg-slate-700/40"
                >
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 text-xs font-bold text-white">
                        {p.name.charAt(0)}
                      </span>
                      <span className="font-medium text-slate-200">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-slate-200">
                    {nf.format(p.quantity)}
                  </td>
                  <td className="py-3 text-slate-400">
                    {nf.format(p.minimumQuantity)}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            critical ? "bg-red-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{ratio}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        critical
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {critical ? "Critical" : "Low"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {lowStock.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No low stock products 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LowStockTable;
