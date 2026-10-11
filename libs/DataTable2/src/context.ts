import { createContext, useContext } from "react";
import type { Row, TableInstance } from "./types";

export const TableContext = createContext<TableInstance<Row> | null>(null);

export function useTableContext<T extends Row>(): TableInstance<T> {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error(
      "useTableContext must be used within a <DataTable> component",
    );
  return ctx as unknown as TableInstance<T>;
}
