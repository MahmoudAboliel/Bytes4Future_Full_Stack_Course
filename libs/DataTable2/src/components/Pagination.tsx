import type { Row } from "../types";
import { useTableContext } from "../context";
import { cn } from "../utils/cn";

const btnBase = cn(
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-sm",
  "text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40",
  "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
);

function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  if (current <= 3) return [0, 1, 2, 3, "…", total - 1];
  if (current >= total - 4)
    return [0, "…", total - 4, total - 3, total - 2, total - 1];
  return [0, "…", current - 1, current, current + 1, "…", total - 1];
}

export function Pagination<T extends Row>() {
  const t = useTableContext<T>();
  const { pageIndex, pageSize } = t.state.pagination;
  const from = t.totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(t.totalRows, (pageIndex + 1) * pageSize);
  const pages = pageWindow(pageIndex, t.pageCount);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <span className="me-auto">
        عرض{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          {from}–{to}
        </strong>{" "}
        من{" "}
        <strong className="text-gray-900 dark:text-gray-100">
          {t.totalRows}
        </strong>
      </span>

      <select
        value={pageSize}
        onChange={(e) => t.setPageSize(Number(e.target.value))}
        className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        aria-label="عدد الصفوف"
      >
        {(t.options.pageSizeOptions ?? [5, 10, 20, 50]).map((n) => (
          <option key={n} value={n}>
            {n} / صفحة
          </option>
        ))}
      </select>

      <button
        type="button"
        className={btnBase}
        disabled={pageIndex === 0}
        onClick={() => t.setPage(pageIndex - 1)}
        aria-label="السابق"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => t.setPage(p)}
            aria-label={`صفحة ${p + 1}`}
            className={cn(
              btnBase,
              p === pageIndex &&
                "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-600",
            )}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        type="button"
        className={btnBase}
        disabled={pageIndex >= t.pageCount - 1}
        onClick={() => t.setPage(pageIndex + 1)}
        aria-label="التالي"
      >
        ›
      </button>
    </div>
  );
}
