import { getValueAtPath } from "./value.js";

function normalizeSearchValue(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(normalizeSearchValue).join(" ");
  return String(value).toLocaleLowerCase();
}

export function filterRecords(
  records = [],
  {
    search = "",
    searchKeys = [],
    filters = {},
    normalize = normalizeSearchValue,
  } = {},
) {
  const query = normalize(search).trim();

  return records.filter((record) => {
    const matchesSearch =
      !query ||
      searchKeys.some((key) =>
        normalize(getValueAtPath(record, key)).includes(query),
      );
    if (!matchesSearch) return false;

    return Object.entries(filters).every(([key, expected]) => {
      if (expected == null || expected === "" || expected.length === 0) {
        return true;
      }

      const actual = getValueAtPath(record, key);
      if (typeof expected === "function") return expected(actual, record);
      if (Array.isArray(expected)) {
        return expected.some((value) => String(value) === String(actual));
      }
      return String(actual) === String(expected);
    });
  });
}
