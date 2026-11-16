import { getValueAtPath } from "./value.js";

export function createTableColumns(
  data = [],
  { exclude = [], labels = {}, accessors = {}, renderers = {} } = {},
) {
  const firstRecord = data.find(
    (record) => record && typeof record === "object" && !Array.isArray(record),
  );
  const excludedKeys = new Set(exclude);

  return Object.keys(firstRecord || {})
    .filter((key) => !excludedKeys.has(key))
    .map((key) => ({
      key,
      header: labels[key] ?? key,
      ...(accessors[key] ? { accessor: accessors[key] } : {}),
      ...(renderers[key] ? { render: renderers[key] } : {}),
    }));
}

export function getTableCellValue(column, record, rowIndex) {
  const accessor = column.accessor ?? column.key;
  return typeof accessor === "function"
    ? accessor(record, rowIndex)
    : getValueAtPath(record, accessor);
}

export function getTableRowKey(record, rowKey = "id", rowIndex = 0) {
  const key =
    typeof rowKey === "function"
      ? rowKey(record, rowIndex)
      : getValueAtPath(record, rowKey);
  return key ?? rowIndex;
}

export function getPaginationState(itemCount, page = 1, pageSize = 8) {
  const safePageSize = Math.max(1, Math.floor(Number(pageSize) || 1));
  const totalPages = Math.max(1, Math.ceil(itemCount / safePageSize));
  const currentPage = Math.max(
    1,
    Math.min(Math.floor(Number(page) || 1), totalPages),
  );
  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, itemCount);

  return {
    currentPage,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    pageSize: safePageSize,
    startIndex,
    totalPages,
  };
}

export function paginateItems(items = [], page = 1, pageSize = 8) {
  const { startIndex, endIndex } = getPaginationState(
    items.length,
    page,
    pageSize,
  );
  return items.slice(startIndex, endIndex);
}
