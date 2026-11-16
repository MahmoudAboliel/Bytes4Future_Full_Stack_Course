import { useMemo, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  classNames,
  createTableColumns,
  getPaginationState,
  getTableCellValue,
  getTableRowKey,
  paginateItems,
} from "../../utils";

const Table = ({
  columns = [],
  data = [],
  autoColumns = false,
  rowKey = "id",
  emptyMessage = "لا توجد سجلات.",
  loading = false,
  pageSize = 8,
  page: controlledPage,
  onPageChange,
  pagination = true,
  caption,
  loadingState = "جارٍ التحميل…",
  emptyState,
  previousLabel = "السابق",
  nextLabel = "التالي",
  onRowClick,
  dense = false,
  className = "",
  ...props
}) => {
  const [internalPage, setInternalPage] = useState(1);
  const page = controlledPage ?? internalPage;
  const resolvedColumns = useMemo(
    () =>
      columns.length || !autoColumns
        ? columns
        : createTableColumns(data, autoColumns === true ? {} : autoColumns),
    [columns, data, autoColumns],
  );
  const {
    currentPage: safePage,
    endIndex,
    hasNext,
    hasPrevious,
    pageSize: effectivePageSize,
    startIndex,
    totalPages,
  } = getPaginationState(data.length, page, pageSize);
  const rows = useMemo(
    () => paginateItems(data, safePage, effectivePageSize),
    [data, safePage, effectivePageSize],
  );
  const changePage = (nextPage) => {
    if (controlledPage === undefined) setInternalPage(nextPage);
    onPageChange?.(nextPage);
  };

  return (
    <div className={classNames("ui-table-shell", className)} {...props}>
      <div className="ui-table-scroll">
        <table className="ui-table">
          {caption && (
            <caption className="ui-visually-hidden">{caption}</caption>
          )}
          <thead className="ui-table-thead sticky top-0 z-10">
            <tr>
              {resolvedColumns.map((col, index) => (
                <th key={col.key ?? col.header ?? index} scope="col" className="ui-table-th">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={resolvedColumns.length || 1}
                  className="ui-table-empty"
                  aria-live="polite"
                >
                  {loadingState}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={resolvedColumns.length || 1}
                  className="ui-table-empty"
                >
                  {emptyState ?? emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={getTableRowKey(row, rowKey, index)}
                  className="ui-table-tr"
                  onClick={
                    onRowClick ? () => onRowClick(row, index) : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row, index);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  className={onRowClick ? "ui-table-row-clickable" : ""}
                >
                  {resolvedColumns.map((col, columnIndex) => {
                    const value = getTableCellValue(col, row, index);
                    return (
                      <td
                        key={col.key ?? col.header ?? columnIndex}
                        className={dense ? "ui-table-td !py-2.5" : "ui-table-td"}
                      >
                        {col.render
                          ? col.render(value, row, index)
                          : (value ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && data.length > effectivePageSize && (
        <div className="ui-table-pagination">
          <span>
            عرض {startIndex + 1}–{endIndex} من {data.length}
          </span>
          <div>
            <button
              type="button"
              disabled={!hasPrevious}
              onClick={() => changePage(safePage - 1)}
              aria-label={previousLabel}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="px-1.5 tabular-nums">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => changePage(safePage + 1)}
              aria-label={nextLabel}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
