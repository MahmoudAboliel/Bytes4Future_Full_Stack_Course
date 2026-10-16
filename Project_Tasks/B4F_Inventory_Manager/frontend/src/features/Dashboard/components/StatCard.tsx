import { toneMap } from "../utils";
import Icon from "./Icon";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  tone: "indigo" | "red" | "emerald" | "amber";
}

export default function StatCard({ title, value, subtitle, icon, tone }: StatCardProps) {
  const t = toneMap[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700 transition hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-100">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${t.bg} ${t.text} ${t.ring}`}
        >
          <Icon path={icon} />
        </div>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l ${t.bar}`}
      />
    </div>
  );
}
