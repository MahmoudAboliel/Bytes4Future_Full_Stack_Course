import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import type { Column, DataTableProps, RowAction, RowId, SortState } from "./types";

/* ================================================================== */
/*  الأيقونات (SVG مضمّنة — بدون أي مكتبة خارجية)                      */
/* ================================================================== */

const PATHS: Record<string, string> = {
  search: "m21 21-4.34-4.34M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  x: "M18 6 6 18M6 6l12 12",
  dots: "M12 5.5h.01M12 12h.01M12 18.5h.01",
  filter: "M4 6h16M7 12h10M10 18h4",
  check: "m5 13 4 4L19 7",
  sort: "m8 9 4-4 4 4M8 15l4 4 4-4",
  inbox:
    "M3 12h4l2 3h6l2-3h4M5 5h14l2 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l2-7Z",
};

interface IconProps {
  name: keyof typeof PATHS;
  className?: string;
  strokeWidth?: number;
}

function Icon({ name, className = "h-4 w-4", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ================================================================== */
/*  Checkbox مع دعم الحالة النصفية                                     */
/* ================================================================== */

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  className = "",
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className={`h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-0 dark:border-slate-600 ${className}`}
    />
  );
}

/* ================================================================== */
/*  قائمة إجراءات السطر                                                */
/* ================================================================== */

interface ActionsMenuProps<T> {
  row: T;
  actions: RowAction<T>[];
  label?: string;
}

function ActionsMenu<T>({
  row,
  actions,
  label = "إجراءات",
}: ActionsMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const visible = actions.filter((a) => (a.hidden ? !a.hidden(row) : true));
  if (!visible.length) return <span className="text-slate-300">—</span>;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition
          hover:bg-slate-100 hover:text-slate-700
          dark:hover:bg-slate-800 dark:hover:text-slate-200
          ${open ? "bg-slate-100 text-slate-700 dark:bg-slate-800" : ""}`}
      >
        <Icon name="dots" className="h-5 w-5" strokeWidth={2} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute inset-e-0 z-40 mt-1 w-44 origin-top rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10
                     dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
        >
          {visible.map((action, i) => (
            <button
              key={i}
              role="menuitem"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                action.onClick(row);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition
                hover:bg-slate-100 dark:hover:bg-slate-700/70
                ${action.className ?? "text-slate-700 dark:text-slate-200"}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  أدوات مساعدة                                                       */
/* ================================================================== */

const alignClass = (align: Column<unknown>["align"]): string =>
  align === "center"
    ? "text-center"
    : align === "end"
      ? "text-end"
      : "text-start";

const isEmpty = (v: unknown): boolean =>
  v === null || v === undefined || v === "";

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

/* ================================================================== */
/*  زر ترقيم صغير                                                     */
/* ================================================================== */

interface PageBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function PageBtn({ children, disabled, onClick, ...rest }: PageBtnProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      {...rest}
      className="inline-flex h-8 items-center justify-center gap-1 rounded-lg px-2.5 text-sm font-medium
                 text-slate-600 transition hover:bg-slate-100
                 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
                 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

/* ================================================================== */
/*  المكوّن الرئيسي                                                    */
/* ================================================================== */

export default function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "لا توجد بيانات لعرضها",
  title,
  subtitle,
  toolbar,
  searchable = true,
  searchPlaceholder = "بحث...",
  filters = [],
  selectable = false,
  onSelectionChange,
  bulkActions = [],
  rowActions = [],
  actionsHeader = "إجراءات",
  pagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  striped = false,
  hoverable = true,
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  /* ---------------- State ---------------- */
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortState<T>>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState<number>(1);
  const [prevPageResetDeps, setPrevPageResetDeps] = useState<{
    search: string;
    filterValues: Record<string, string>;
    pageSize: number;
  } | null>(null);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [selected, setSelected] = useState<Set<RowId>>(() => new Set());

  /* ---------------- Helpers ---------------- */
  const getCellValue = (row: T, col: Column<T>): unknown =>
    col.accessor
      ? col.accessor(row, 0)
      : (row as Record<string, unknown>)[col.key];

  const getRowId = (row: T): RowId => {
    const id = (row as Record<string, unknown>)[rowKey as string];
    return id as RowId;
  };

  const updateSelection = (next: Set<RowId>) => {
    setSelected(next);
    onSelectionChange?.(data.filter((r) => next.has(getRowId(r))));
  };

  /* ---------------- الفلترة ---------------- */
  const filtered = useMemo<T[]>(() => {
    let result = data;

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((row) =>
        columns.some((col) => {
          if (col.searchable === false) return false;
          const value = getCellValue(row, col);
          return String(value ?? "")
            .toLowerCase()
            .includes(q);
        }),
      );
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (isEmpty(value)) return;
      const filter = filters.find((f) => String(f.key) === key);
      result = result.filter((row) => {
        const rowValue = filter?.accessor
          ? filter.accessor(row)
          : (row as Record<string, unknown>)[key];
        return String(rowValue) === String(value);
      });
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filterValues, columns, filters]);

  /* ---------------- الترتيب ---------------- */
  const sorted = useMemo<T[]>(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;

    const dir = sort.dir === "asc" ? 1 : -1;
    const getVal = (row: T): unknown =>
      col.sortAccessor ? col.sortAccessor(row) : getCellValue(row, col);

    return [...filtered].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      if (av instanceof Date && bv instanceof Date)
        return (av.getTime() - bv.getTime()) * dir;
      return (
        String(av).localeCompare(String(bv), "ar", { numeric: true }) * dir
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sort, columns]);

  /* ---------------- الترقيم ---------------- */
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = pagination
    ? sorted.slice((page - 1) * pageSize, page * pageSize)
    : sorted;

const currentPageResetDeps = { search, filterValues, pageSize };
if (
  prevPageResetDeps === null ||
  prevPageResetDeps.search !== currentPageResetDeps.search ||
  prevPageResetDeps.filterValues !== currentPageResetDeps.filterValues ||
  prevPageResetDeps.pageSize !== currentPageResetDeps.pageSize
) {
  setPrevPageResetDeps(currentPageResetDeps);
  setPage(1);
}
//   useEffect(() => {
//     setPage(1);
//   }, [search, filterValues, pageSize]);

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

  /* ---------------- التحديد ---------------- */
  const pageIds = pageRows.map(getRowId);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const somePageSelected =
    !allPageSelected && pageIds.some((id) => selected.has(id));

  const toggleRow = (id: RowId) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    updateSelection(next);
  };

  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allPageSelected) pageIds.forEach((id) => next.delete(id));
    else pageIds.forEach((id) => next.add(id));
    updateSelection(next);
  };

  const clearSelection = () => updateSelection(new Set());

  /* ---------------- الترتيب بالنقر ---------------- */
  const toggleSort = (key: string) => {
    if (!sort || sort.key !== key) setSort({ key, dir: "asc" });
    else if (sort.dir === "asc") setSort({ key, dir: "desc" });
    else setSort(null);
  };

  /* ---------------- إعادة تعيين الفلاتر ---------------- */
  const hasActiveFilters =
    search.trim() !== "" ||
    Object.values(filterValues).some((v) => !isEmpty(v));

  const resetFilters = () => {
    setSearch("");
    setFilterValues({});
  };

  const totalCols =
    columns.length + (selectable ? 1 : 0) + (rowActions.length ? 1 : 0);
  const from = sorted.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, sorted.length);

  /* ================================================================ */
  return (
    <div
      // dir="ltr"
      className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm
                  dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {/* ---------- الرأس ---------- */}
      {(title || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* ---------- البحث والفلاتر ---------- */}
      {(searchable || filters.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
          {searchable && (
            <div className="relative min-w-50 flex-1 sm:max-w-xs">
              <Icon
                name="search"
                className="pointer-events-none absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-9 text-sm text-slate-700
                           placeholder:text-slate-400 outline-none transition
                           focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                           dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
                           dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-e-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition
                             hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                >
                  <Icon name="x" className="h-3.5 w-3.5" strokeWidth={2.2} />
                </button>
              )}
            </div>
          )}

          {filters.map((f) => {
            const fKey = String(f.key);
            return (
              <div key={fKey} className="relative">
                <select
                  value={filterValues[fKey] ?? ""}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      [fKey]: e.target.value,
                    }))
                  }
                  className="h-9 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white
                             pe-8 ps-3 text-sm text-slate-600 outline-none transition
                             focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                             dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">{f.label}: الكل</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute inset-e-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                />
              </div>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-500
                         transition hover:bg-slate-100 hover:text-slate-700
                         dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Icon name="x" className="h-3.5 w-3.5" strokeWidth={2.2} />
              مسح
            </button>
          )}
        </div>
      )}

      {/* ---------- شريط الإجراءات الجماعية ---------- */}
      {selectable && selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 bg-indigo-50/70 px-4 py-2.5 dark:border-indigo-900/50 dark:bg-indigo-950/40 sm:px-5">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            تم تحديد {selected.size} عنصر
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  action.onClick(data.filter((r) => selected.has(getRowId(r))))
                }
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition
                  ${
                    action.className ??
                    "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* ---------- الجدول ---------- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={somePageSelected}
                    onChange={toggleAllOnPage}
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sort?.key === col.key;
                const style: CSSProperties | undefined = col.width
                  ? { width: col.width }
                  : undefined;

                return (
                  <th
                    key={col.key}
                    style={style}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide
                                text-slate-500 dark:text-slate-400
                                ${alignClass(col.align)} ${col.headerClassName ?? ""}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1.5 rounded transition
                          hover:text-slate-800 dark:hover:text-slate-100
                          ${isSorted ? "text-indigo-600 dark:text-indigo-400" : ""}
                          ${col.align === "end" ? "flex-row-reverse" : ""}`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          <Icon
                            name={
                              sort!.dir === "asc" ? "chevronUp" : "chevronDown"
                            }
                            className="h-3.5 w-3.5"
                            strokeWidth={2.4}
                          />
                        ) : (
                          <Icon
                            name="sort"
                            className="h-3.5 w-3.5 opacity-40"
                            strokeWidth={2}
                          />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}

              {rowActions.length > 0 && (
                <th className="w-16 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <span className="sr-only">{actionsHeader}</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* حالة التحميل */}
            {loading &&
              Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div
                        className="h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                        style={{ width: `${45 + ((i * 13) % 45)}%` }}
                      />
                    </td>
                  ))}
                  {rowActions.length > 0 && (
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </td>
                  )}
                </tr>
              ))}

            {/* الحالة الفارغة */}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={totalCols} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Icon name="inbox" className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {emptyMessage}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        مسح الفلاتر
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* الصفوف */}
            {!loading &&
              pageRows.map((row, index) => {
                const id = getRowId(row);
                const isSelected = selected.has(id);

                return (
                  <tr
                    key={String(id) || index}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors
                      ${onRowClick ? "cursor-pointer" : ""}
                      ${isSelected ? "bg-indigo-50/70 dark:bg-indigo-950/30" : ""}
                      ${
                        !isSelected && striped && index % 2 === 1
                          ? "bg-slate-50/60 dark:bg-slate-800/20"
                          : ""
                      }
                      ${
                        hoverable && !isSelected
                          ? "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          : ""
                      }
                      ${
                        hoverable && isSelected
                          ? "hover:bg-indigo-100/60 dark:hover:bg-indigo-950/50"
                          : ""
                      }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-slate-700 dark:text-slate-300
                                    ${alignClass(col.align)} ${col.className ?? ""}`}
                      >
                        {col.render ? (
                          col.render(row, index)
                        ) : isEmpty(getCellValue(row, col)) ? (
                          <span className="text-slate-300 dark:text-slate-600">
                            —
                          </span>
                        ) : (
                          String(getCellValue(row, col))
                        )}
                      </td>
                    ))}

                    {rowActions.length > 0 && (
                      <td className="px-4 py-3 text-center">
                        <ActionsMenu
                          row={row}
                          actions={rowActions}
                          label={actionsHeader}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ---------- الترقيم ---------- */}
      {pagination && !loading && sorted.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>عرض</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs
                         text-slate-600 outline-none focus:border-indigo-400
                         dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="tabular-nums">
              من إجمالي{" "}
              <b className="text-slate-700 dark:text-slate-200">
                {sorted.length}
              </b>{" "}
              — ({from}–{to})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <PageBtn disabled={page === 1} onClick={() => setPage(1)}>
              الأولى
            </PageBtn>
            <PageBtn
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="السابق"
            >
              <Icon name="chevronRight" className="h-4 w-4" />
            </PageBtn>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`e-${i}`} className="px-2 text-sm text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium tabular-nums transition
                    ${
                      p === page
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                >
                  {p}
                </button>
              ),
            )}

            <PageBtn
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="التالي"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </PageBtn>
            <PageBtn
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              الأخيرة
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}
