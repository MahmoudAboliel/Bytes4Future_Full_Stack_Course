// ── Hook (headless — build your own UI) ──
export { useTable } from "./src/hooks/useTable";
export { TableContext, useTableContext } from "./src/context";

// ── Ready-made components ──
export { DataTable } from "./src/components/DataTable";
export type { DataTableProps } from "./src/components/DataTable";
export { Toolbar } from "./src/components/Toolbar";
export { TableHeader } from "./src/components/TableHeader";
export { TableBody } from "./src/components/TableBody";
export { Pagination } from "./src/components/Pagination";
export { Checkbox } from "./src/components/Checkbox";

// ── Utilities ──
export { exportToCsv } from "./src/utils/csv";
export { cn } from "./src/utils/cn";

// ── Types ──
export type {
  Row,
  ColumnDef,
  TableOptions,
  TableInstance,
  SortState,
  PaginationState,
} from "./src/types";
