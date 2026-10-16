import type { DashboardStats } from "../types";
import { icons, nf } from "../utils";
import StatCard from "./StatCard";

const StatSection = ({ stats }: { stats: DashboardStats }) => {
  const data = [
    {
      title: "Total Products",
      value: nf.format(stats.productsCount),
      subtitle: `Total items in stock: ${nf.format(stats.totalStock)}`,
      icon: icons.box,
      tone: "indigo",
    },
    {
      title: "Low Stock Products",
      value: nf.format(stats.lowStockCount),
      subtitle: "Needs restocking",
      icon: icons.alert,
      tone: "red",
    },
    {
      title: "Total Inbound",
      value: nf.format(stats.totalIn),
      subtitle: "units in last 7 days",
      icon: icons.arrowDown,
      tone: "emerald",
    },
    {
      title: "Total Outbound",
      value: nf.format(stats.totalOut),
      subtitle: "units in last 7 days",
      icon: icons.arrowUp,
      tone: "amber",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((st) => (
        <StatCard
          key={st.tone}
          title={st.title}
          value={st.value}
          subtitle={st.subtitle}
          icon={st.icon}
          tone={st.tone as "indigo" | "red" | "emerald" | "amber"}
        />
      ))}
    </section>
  );
};

export default StatSection;
