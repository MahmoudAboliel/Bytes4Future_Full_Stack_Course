import type { Row } from "../types";
import { useTableContext } from "../context";
import { alignClass, cn } from "../utils/cn";
import { Checkbox } from "./Checkbox";

export function TableBody<T extends Row>() {
  const t = useTableContext<T>();
  const selection = t.options.enableSelection !== false;
  const colSpan = t.columns.length + (selection ? 1 : 0);
  const { pageIndex, pageSize } = t.state.pagination;

  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {t.rows.length === 0 ? (
        <tr>
          <td
            colSpan={colSpan}
            className="px-4 py-12 text-center text-gray-400 dark:text-gray-500"
          >
            {t.options.placeholder ?? "لا توجد بيانات مطابقة"}
          </td>
        </tr>
      ) : (
        t.rows.map((row, i) => {
          const id = t.getRowId(row, pageIndex * pageSize + i);
          const selected = t.isRowSelected(id);
          return (
            <tr
              key={id}
              className={cn(
                "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                selected &&
                  "bg-indigo-50/70 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15",
              )}
            >
              {selection && (
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selected}
                    onChange={() => t.toggleRowSelected(id)}
                    aria-label={`تحديد الصف ${i + 1}`}
                  />
                </td>
              )}
              {t.columns.map((col) => (
                <td
                  key={col.id}
                  className={cn(
                    "px-4 py-3",
                    alignClass(col.align),
                    col.className,
                  )}
                >
                  {col.cell
                    ? col.cell(row, i)
                    : String(t.getValue(row, col) ?? "—")}
                </td>
              ))}
            </tr>
          );
        })
      )}
    </tbody>
  );
}
