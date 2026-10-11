import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ColumnDef,
  PaginationState,
  Row,
  SortState,
  TableInstance,
  TableOptions,
} from "../types";

/** Default "contains" filter — case-insensitive, works with numbers too */
function defaultFilter(value: unknown, filter: string): boolean {
  if (!filter) return true;
  if (value == null) return false;
  return String(value).toLocaleLowerCase().includes(filter.toLocaleLowerCase());
}

/** Smart comparator: numbers numerically, dates chronologically, strings with locale numeric awareness */
function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function useTable<T extends Row>(
  data: T[],
  columns: ColumnDef<T>[],
  options: TableOptions<T> = {},
): TableInstance<T> {
  const {
    getRowId: getRowIdOpt,
    defaultPageSize = 10,
    initialSorting = [],
  } = options;

  const getRowId = useCallback(
    (row: T, index: number) => getRowIdOpt?.(row, index) ?? String((row as Record<string, unknown>).id ?? index),
    [getRowIdOpt],
  );

  const [sorting, setSorting] = useState<SortState[]>(initialSorting);
  const [globalFilter, setGlobalFilterState] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: defaultPageSize });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  /** Reset to first page whenever filters change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagination((p) => (p.pageIndex === 0 ? p : { ...p, pageIndex: 0 }));
  }, [globalFilter, columnFilters]);

  const getValue = useCallback((row: T, column: ColumnDef<T>): unknown => {
    if (column.accessor) {
      return typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor];
    }
    return row[column.id];
  }, []);

  const visibleColumns = useMemo(
    () => columns.filter((c) => columnVisibility[c.id] !== false),
    [columns, columnVisibility],
  );

  // ── 1. Filter (global + per-column) ──────────────────────────
  const filtered = useMemo(() => {
    const gf = globalFilter.trim();
    return data.filter((row) => {
      if (gf && !visibleColumns.some((col) => defaultFilter(getValue(row, col), gf))) {
        return false;
      }
      for (const col of visibleColumns) {
        const f = columnFilters[col.id];
        if (f) {
          const ok = col.filterFn ? col.filterFn(row, f) : defaultFilter(getValue(row, col), f);
          if (!ok) return false;
        }
      }
      return true;
    });
  }, [data, globalFilter, columnFilters, visibleColumns, getValue]);

  // ── 2. Sort (multi-column chained comparator) ────────────────
  const sorted = useMemo(() => {
    if (!sorting.length) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      for (const s of sorting) {
        const col = columns.find((c) => c.id === s.id);
        if (!col) continue;
        const cmp = col.sortFn
          ? col.sortFn(a, b)
          : compareValues(getValue(a, col), getValue(b, col));
        if (cmp !== 0) return s.desc ? -cmp : cmp;
      }
      return 0;
    });
    return arr;
  }, [filtered, sorting, columns, getValue]);

  // ── 3. Paginate ──────────────────────────────────────────────
  const pageCount = Math.max(1, Math.ceil(sorted.length / pagination.pageSize));
  const rows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return sorted.slice(start, start + pagination.pageSize);
  }, [sorted, pagination]);

  // ── Sorting actions ─────────────────────────────────────────
  const toggleSort = useCallback((columnId: string, multi = false) => {
    setSorting((prev) => {
      const useMulti = (options.enableMultiSort ?? true) && multi;
      const base = useMulti ? prev : prev.filter((s) => s.id === columnId);
      const existing = base.find((s) => s.id === columnId);
      let next: SortState[];
      if (!existing) next = [...base, { id: columnId, desc: false }];
      else if (!existing.desc) next = base.map((s) => (s.id === columnId ? { ...s, desc: true } : s));
      else next = base.filter((s) => s.id !== columnId);
      return useMulti ? next : next.slice(-1);
    });
  }, [options.enableMultiSort]);

  const getSort = useCallback(
    (columnId: string) => sorting.find((s) => s.id === columnId),
    [sorting],
  );

  // ── Selection actions ───────────────────────────────────────
  const pageRowIds = rows.map((r, i) => getRowId(r, pagination.pageIndex * pagination.pageSize + i));
  const isAllRowsSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selectedIds.has(id));

  const toggleRowSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAllRowsSelected = useCallback(() => {
    const ids = rows.map((r, i) => getRowId(r, pagination.pageIndex * pagination.pageSize + i));
    const all = ids.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (all ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [rows, selectedIds, getRowId, pagination.pageIndex, pagination.pageSize]);

  const isRowSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const selectedRows = useMemo(
    () => data.filter((row, i) => selectedIds.has(getRowId(row, i))),
    [data, selectedIds, getRowId],
  );

  return {
    rows,
    allFilteredRows: sorted,
    columns: visibleColumns,
    allColumns: columns,
    totalRows: data.length,
    pageCount,
    options,
    selectedRows,
    state: { sorting, globalFilter, columnFilters, pagination, selectedIds, columnVisibility },
    getRowId,
    getValue,
    setGlobalFilter: setGlobalFilterState,
    setColumnFilter: (columnId, value) =>
      setColumnFilters((prev) => ({ ...prev, [columnId]: value })),
    resetFilters: () => { setGlobalFilterState(''); setColumnFilters({}); setSorting([]); },
    toggleSort,
    getSort,
    setPage: (page) =>
      setPagination((p) => ({ ...p, pageIndex: Math.min(Math.max(0, page), pageCount - 1) })),
    setPageSize: (size) => setPagination({ pageIndex: 0, pageSize: size }),
    toggleRowSelected,
    toggleAllRowsSelected,
    isRowSelected,
    isAllRowsSelected,
    toggleColumnVisibility: (columnId) =>
      setColumnVisibility((prev) => ({ ...prev, [columnId]: prev[columnId] === false })),
  };
}
