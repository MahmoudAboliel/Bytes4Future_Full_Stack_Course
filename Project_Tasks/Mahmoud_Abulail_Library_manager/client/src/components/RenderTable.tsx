import { useMemo, useState, useEffect, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type BaseColumn = {
  label: string;
  order: number;
};

export type Column<T> =
  | (BaseColumn & { type: "text"; name: string })
  | (BaseColumn & { type: "date"; name: string })
  | (BaseColumn & { type: "img"; name: string })
  | (BaseColumn & {
      type: "actions";
      name: string;
      actions: Record<string, (row: T) => ReactNode>;
    });

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  emptyMessage?: string;
  sortFn?: (a: T, b: T) => number;
  getRowKey?: (row: T, index: number) => string | number;
};

function renderCell<T extends Record<string, unknown>>(
  column: Column<T>,
  row: T,
): ReactNode {
  switch (column.type) {
    case "text":
      return String(row[column.name] ?? "");

    case "date": {
      const value = row[column.name];
      return value ? new Date(value as string).toDateString() : "--";
    }

    case "img": {
      const value = row[column.name] as string | undefined;
      if (!value) return "--";
      return (
        <img
          src={value}
          alt={value.split("/").pop() ?? "image"}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
        />
      );
    }

    case "actions":
      return (
        <div className="flex items-center gap-2">
          {Object.entries(column.actions).map(([key, render]) => (
            <span key={key}>{render(row)}</span>
          ))}
        </div>
      );
  }
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  emptyMessage = "لا توجد بيانات",
  sortFn,
  getRowKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<T[]>(data);

  // ترتيب الأعمدة حسب order
  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [columns],
  );

  // إعادة فلترة/ترتيب الصفوف عند تغيّر البيانات أو نص البحث
  useEffect(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? data.filter((row) => JSON.stringify(row).toLowerCase().includes(q))
      : data;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(sortFn ? [...filtered].sort(sortFn) : filtered);
  }, [data, query, sortFn]);

  return (
    <div className="space-y-4">
      {searchable && (
        <Input
          type="search"
          placeholder="بحث..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {sortedColumns.map((col) => (
                <TableHead key={col.name} className="text-right">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sortedColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={getRowKey ? getRowKey(row, index) : index}>
                  {sortedColumns.map((col) => (
                    <TableCell key={col.name}>{renderCell(col, row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
