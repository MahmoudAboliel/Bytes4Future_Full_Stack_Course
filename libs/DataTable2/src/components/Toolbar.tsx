import { useEffect, useRef, useState } from "react";
import type { Row } from "../types";
import { useTableContext } from "../context";
import { cn } from "../utils/cn";
import { exportToCsv } from "../utils/csv";
import { Checkbox } from "./Checkbox";

const btnClass = cn(
  "inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm",
  "text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-indigo-600",
  "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
);

export function Toolbar<T extends Row>() {
  const t = useTableContext<T>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasFilters =
    t.state.globalFilter !== "" ||
    Object.values(t.state.columnFilters).some(Boolean) ||
    t.state.sorting.length > 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleExport = () => {
    exportToCsv(
      "table-export.csv",
      t.columns.map((c) => String(c.header ?? c.id)),
      t.allFilteredRows.map((row) =>
        t.columns.map((c) => t.getValue(row, c) ?? ""),
      ),
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── Global search ── */}
      <div className="relative min-w-56 flex-1">
        <span className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-gray-400">
          ⌕
        </span>
        <input
          value={t.state.globalFilter}
          onChange={(e) => t.setGlobalFilter(e.target.value)}
          placeholder="بحث في جميع الأعمدة..."
          className={cn(
            "w-full rounded-lg border border-gray-300 bg-white py-1.5 pe-3 ps-9 text-sm shadow-sm",
            "placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
          )}
        />
      </div>

      {t.options.enableSelection !== false && t.selectedRows.length > 0 && (
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
          {t.selectedRows.length} محدد
        </span>
      )}

      <div className="ms-auto flex items-center gap-2">
        {hasFilters && (
          <button type="button" onClick={t.resetFilters} className={btnClass}>
            ✕ مسح الفلاتر
          </button>
        )}

        {t.options.enableCsvExport !== false && (
          <button type="button" onClick={handleExport} className={btnClass}>
            ⬇ تصدير CSV
          </button>
        )}

        {/* ── Column visibility menu ── */}
        {t.options.enableColumnVisibility !== false && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={btnClass}
            >
              ▦ الأعمدة
            </button>
            {menuOpen && (
              <div
                className={cn(
                  "absolute inset-e-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg",
                  "dark:border-gray-700 dark:bg-gray-800",
                )}
              >
                {t.allColumns.map((col) => (
                  <label
                    key={col.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Checkbox
                      checked={t.state.columnVisibility[col.id] !== false}
                      onChange={() => t.toggleColumnVisibility(col.id)}
                    />
                    <span className="dark:text-gray-200">
                      {String(col.header ?? col.id)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
