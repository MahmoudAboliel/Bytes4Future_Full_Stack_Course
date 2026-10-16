import type { RecentMovement } from "../types";
import { formatDate, formatTime, icons } from "../utils";
import Icon from "./Icon";

const RecentMovements = ({
  recentMovements,
}: {
  recentMovements: RecentMovement[];
}) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700">
      <div className="flex items-center gap-2">
        <Icon path={icons.activity} className="h-5 w-5 text-indigo-400" />
        <h2 className="text-base font-semibold text-slate-100">
          Recent Movements
        </h2>
      </div>

      <ul className="mt-4 space-y-3">
        {recentMovements.map((m) => {
          const isIn = m.type === "in";
          return (
            <li
              key={m._id}
              className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-700/50"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  isIn
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <Icon
                  path={isIn ? icons.arrowDown : icons.arrowUp}
                  className="h-4 w-4"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">
                  {m.productId.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {m.note ?? "No notes"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {formatDate(m.date)} · {formatTime(m.date)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${
                  isIn
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {isIn ? "+" : "−"}
                {m.amount}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentMovements;
