import type { Row, SortState } from "../types";
import { useTableContext } from "../context";
import { alignClass, cn } from "../utils/cn";
import { Checkbox } from "./Checkbox";

function SortIcon({ sort, order }: { sort?: SortState; order: number }) {
  if (!sort) return <span className="text-gray-300 dark:text-gray-600">⇅</span>;
  return (
    <span className="inline-flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400">
      {sort.desc ? "↓" : "↑"}
      {order > 0 && <sup className="text-[9px] font-bold">{order + 1}</sup>}
    </span>
  );
}

export function TableHeader<T extends Row>() {
  const t = useTableContext<T>();
  const selection = t.options.enableSelection !== false;
  const colFilters = t.options.enableColumnFilters !== false;

  const inputClass = cn(
    "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs shadow-sm",
    "placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
    "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
  );

  return (
    <thead className="bg-gray-50 dark:bg-gray-800/60">
      <tr className="border-b border-gray-200 dark:border-gray-700">
        {selection && (
          <th className="w-10 px-4 py-3">
            <Checkbox
              checked={t.isAllRowsSelected}
              indeterminate={
                !t.isAllRowsSelected &&
                t.rows.some((r, i) =>
                  t.isRowSelected(
                    t.getRowId(
                      r,
                      t.state.pagination.pageIndex *
                        t.state.pagination.pageSize +
                        i,
                    ),
                  ),
                )
              }
              onChange={t.toggleAllRowsSelected}
              aria-label="تحديد الكل"
            />
          </th>
        )}
        {t.columns.map((col) => {
          const sort = t.getSort(col.id);
          const order = t.state.sorting.findIndex((s) => s.id === col.id);
          const sortable = col.sortable !== false;
          return (
            <th
              key={col.id}
              style={col.width ? { width: col.width } : undefined}
              className={cn(
                "px-4 py-3 font-semibold whitespace-nowrap",
                alignClass(col.align),
                col.headerClassName,
              )}
            >
              {sortable ? (
                <button
                  type="button"
                  onClick={(e) => t.toggleSort(col.id, e.shiftKey)}
                  title="انقر للترتيب — Shift+انقر للترتيب المتعدد"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <span>{col.header ?? col.id}</span>
                  <SortIcon sort={sort} order={order} />
                </button>
              ) : (
                (col.header ?? col.id)
              )}
            </th>
          );
        })}
      </tr>

      {/* ── Per-column filter row ── */}
      {colFilters && (
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {selection && <th className="px-4 py-2" />}
          {t.columns.map((col) => (
            <th key={col.id} className="px-2 py-2">
              {col.filterable !== false && (
                <input
                  value={t.state.columnFilters[col.id] ?? ""}
                  onChange={(e) => t.setColumnFilter(col.id, e.target.value)}
                  placeholder="فلتر..."
                  className={inputClass}
                  aria-label={`فلتر ${String(col.header ?? col.id)}`}
                />
              )}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
}
