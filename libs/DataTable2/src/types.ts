import type { ReactNode } from 'react';

/** A table row: any object shape */
export type Row = Record<string, unknown>;

export interface SortState {
  id: string;
  desc: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface ColumnDef<T extends Row = Row> {
  /** Unique column id — also used to read row[colId] when no accessor */
  id: string;
  /** Key of the row object or a getter function */
  accessor?: keyof T | ((row: T) => unknown);
  header?: ReactNode;
  /** Custom cell renderer. Falls back to the raw value */
  cell?: (row: T, rowIndex: number) => ReactNode;
  sortable?: boolean;      // default: true
  filterable?: boolean;    // default: true (controls the per-column filter input)
  sortFn?: (a: T, b: T) => number;
  filterFn?: (row: T, filterValue: string) => boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  className?: string;
  headerClassName?: string;
}

export interface TableOptions<T extends Row = Row> {
  getRowId?: (row: T, index: number) => string;
  defaultPageSize?: number;          // default: 10
  pageSizeOptions?: number[];        // default: [5, 10, 20, 50]
  enableMultiSort?: boolean;         // default: true (hold Shift while clicking headers)
  enableSelection?: boolean;         // default: true
  enableColumnVisibility?: boolean;  // default: true
  enableGlobalFilter?: boolean;      // default: true
  enableColumnFilters?: boolean;     // default: true
  enablePagination?: boolean;        // default: true
  enableCsvExport?: boolean;         // default: true
  initialSorting?: SortState[];
  placeholder?: ReactNode;           // empty-state content
}

export interface TableInstance<T extends Row = Row> {
  /** Rows of the current page (after filter + sort) */
  rows: T[];
  /** All rows after filter + sort (ignores pagination) */
  allFilteredRows: T[];
  /** Visible columns only */
  columns: ColumnDef<T>[];
  /** All columns (including hidden) — use for visibility menus */
  allColumns: ColumnDef<T>[];
  totalRows: number;
  pageCount: number;
  options: TableOptions<T>;
  selectedRows: T[];
  state: {
    sorting: SortState[];
    globalFilter: string;
    columnFilters: Record<string, string>;
    pagination: PaginationState;
    selectedIds: Set<string>;
    columnVisibility: Record<string, boolean>;
  };
  getRowId: (row: T, index: number) => string;
  getValue: (row: T, column: ColumnDef<T>) => unknown;
  setGlobalFilter: (value: string) => void;
  setColumnFilter: (columnId: string, value: string) => void;
  resetFilters: () => void;
  toggleSort: (columnId: string, multi?: boolean) => void;
  getSort: (columnId: string) => SortState | undefined;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleRowSelected: (id: string) => void;
  toggleAllRowsSelected: () => void;
  isRowSelected: (id: string) => boolean;
  isAllRowsSelected: boolean;
  toggleColumnVisibility: (columnId: string) => void;
}
