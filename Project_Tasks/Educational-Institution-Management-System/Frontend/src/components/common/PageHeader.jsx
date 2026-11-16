import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { classNames } from "../../utils";

/** Breadcrumb trail (RTL: separator points left). */
export const Breadcrumbs = ({ items = [] }) => (
  <nav
    className="scrollbar-thin flex items-center gap-1 overflow-x-auto text-xs text-muted"
    aria-label="مسار التنقل"
  >
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <span key={index} className="flex items-center gap-1 whitespace-nowrap">
          {index > 0 && (
            <ChevronLeft className="h-3.5 w-3.5 text-muted/60" />
          )}
          {item.to && !isLast ? (
            <Link to={item.to} className="transition hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className={isLast ? "font-medium text-ink" : ""}>
              {item.label}
            </span>
          )}
        </span>
      );
    })}
  </nav>
);

/** Page title block: breadcrumbs + title + description + trailing action. */
const PageHeader = ({
  title,
  description,
  breadcrumbs,
  action,
  className = "",
}) => (
  <div
    className={classNames(
      "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
      className,
    )}
  >
    <div className="min-w-0">
      {breadcrumbs && (
        <div className="mb-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {title}
      </h1>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
