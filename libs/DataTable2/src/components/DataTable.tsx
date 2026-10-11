import type { ReactNode } from "react";
import type { ColumnDef, Row, TableOptions } from "../types";
import { useTable } from "../hooks/useTable";
import { TableContext } from "../context";
import { Toolbar } from "./Toolbar";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";
import { cn } from "../utils/cn";

export interface DataTableProps<T extends Row> {
  data: T[];
  columns: ColumnDef<T>[];
  options?: TableOptions<T>;
  className?: string;
  /** Extra content rendered between toolbar and table */
  toolbar?: ReactNode;
}

/**
 * Full-featured, ready-to-use table.
 * Every feature can be toggled through `options`.
 */
export function DataTable<T extends Row>({
  data,
  columns,
  options,
  className,
  toolbar,
}: DataTableProps<T>) {
  const table = useTable(data, columns, options);

  return (
    <TableContext.Provider value={table as never}>
      <div
        className={cn(
          "w-full space-y-3 text-gray-900 dark:text-gray-100",
          className,
        )}
      >
        {options?.enableGlobalFilter !== false && <Toolbar />}
        {toolbar}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <TableHeader />
              <TableBody />
            </table>
          </div>
        </div>

        {options?.enablePagination !== false && <Pagination />}
      </div>
    </TableContext.Provider>
  );
}
