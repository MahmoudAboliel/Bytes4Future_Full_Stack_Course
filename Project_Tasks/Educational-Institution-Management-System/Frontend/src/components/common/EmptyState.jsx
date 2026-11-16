import { Inbox } from "lucide-react";
import { classNames } from "../../utils";

/** Centered empty-state placeholder, matching the prototype UX. */
const EmptyState = ({
  icon,
  title = "لا توجد بيانات",
  description,
  action,
  compact = false,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-canvas/60 text-center",
        compact ? "px-4 py-8" : "px-6 py-14",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-muted shadow-card">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-sm font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
