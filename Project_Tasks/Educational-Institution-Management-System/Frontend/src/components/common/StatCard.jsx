import Card from "./Card";
import { classNames } from "../../utils";

const accentMap = {
  blue: "bg-brand-blue/10 text-brand-blue",
  amber: "bg-brand-amber/15 text-[#b67d2e]",
  lavender: "bg-brand-lavender/15 text-[#8b4fb8]",
  ink: "bg-ink/10 text-ink",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
};

/** KPI card used across the dashboards. */
const StatCard = ({
  label,
  value,
  icon,
  hint,
  accent = "blue",
  className = "",
}) => (
  <Card className={classNames("transition hover:shadow-card-lg", className)}>
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      {icon && (
        <div
          className={classNames(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentMap[accent] || accentMap.blue,
          )}
        >
          {icon}
        </div>
      )}
    </div>
  </Card>
);

export default StatCard;
