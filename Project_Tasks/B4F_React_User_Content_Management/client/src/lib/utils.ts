import type { ColumnConfig } from "./types";

export { cn } from "cn";

export const extractHeaders = <T>(columns: ColumnConfig<T>[]): string[] => {
  return columns.map((col) => col.header);
};

