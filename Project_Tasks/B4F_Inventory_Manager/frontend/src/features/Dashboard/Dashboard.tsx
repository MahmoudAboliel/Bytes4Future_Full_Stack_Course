import { useEffect, useState } from "react";
import type { ApiResponse, DashboardData } from "./types";
import StatSection from "./components/StatSection";
import TrendChart from "./components/TrendChart";
import InOutBoundRatioChart from "./components/InOutBoundRatioChart";
import TopProductsChart from "./components/TopProductsChart";
import Header from "./components/Header";
import RecentMovements from "./components/RecentMovements";
import LowStockTable from "./components/LowStockTable";
import { base_url } from "../../core/end_points";
import { getData } from "../../core/http_methods";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = (await getData(base_url)) as ApiResponse<DashboardData>;
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Unknown error: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  console.log(data)

  if (loading) return <div className="p-8 text-slate-400">Loading…</div>;
  if (error || !data) return <div className="p-8 text-red-400">{error}</div>;

  const { stats, trend, ratio, topProducts, recent, lowStock } = data;

  return (
    <div dir="ltr" className="">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ============ Header ============ */}
        <Header />
        {/* ============ Stat Cards ============ */}
        <StatSection stats={stats} />
        {/* ============ Charts ============ */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trend Chart */}
          <TrendChart trendData={trend} />
          {/* Pie Chart */}
          <InOutBoundRatioChart stats={stats} ratio={ratio} />
        </section>
        {/* ============ Top Products + Recent Movements ============ */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top Moving Products */}
          <TopProductsChart topProducts={topProducts} />
          {/* Recent Movements */}
          <RecentMovements recentMovements={recent} />
        </section>
        {/* ============ Low Stock Table ============ */}
        <LowStockTable stats={stats} lowStock={lowStock} />
      </div>
    </div>
  );
}
