// src/components/dynamic-form/utils/date.ts

/**
 * يحوّل Date إلى "YYYY-MM-DD" باستخدام المكوّنات المحلية.
 * لا يستخدم toISOString لأنه يحوّل إلى UTC ويقتطع يوماً.
 */
export function toDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * يحوّل Date + وقت إلى ISO بالصيغة المحلية (بدون Z).
 * مناسب لحقول "datetime-local".
 */
export function toLocalDateTimeString(d: Date): string {
  const date = toDateString(d);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${date}T${hh}:${mm}`;
}

/**
 * يحوّل Date إلى ISO للوقت فقط "HH:mm".
 */
export function toTimeString(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * يحلّل "YYYY-MM-DD" كمنتصف ليل محلي (ليس UTC).
 * `new Date("2024-01-15")` يعطي UTC → قد يظهر يوم سابق.
 */
export function parseDateString(s: string | null | undefined): Date | null {
  if (!s) return null;
  // "2024-01-15" → [2024, 01, 15]
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // ✅ local midnight
}

/**
 * يحلّل "YYYY-MM-DDTHH:mm" كوقت محلي.
 */
export function parseLocalDateTime(s: string | null | undefined): Date | null {
  if (!s) return null;
  const [datePart, timePart] = s.split("T");
  const date = parseDateString(datePart);
  if (!date) return null;
  if (timePart) {
    const [h, m] = timePart.split(":").map(Number);
    date.setHours(h ?? 0, m ?? 0, 0, 0);
  }
  return date;
}

/**
 * تنسيق للعرض حسب اللغة (مثلاً: "15 يناير 2024" بالعربية).
 */
export function formatDate(
  s: string | null | undefined,
  locale = "en",
): string {
  const d = parseDateString(s);
  if (!d) return "";
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
