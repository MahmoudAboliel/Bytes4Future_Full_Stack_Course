export function exportToCsv(
  filename: string,
  headers: string[],
  rows: unknown[][],
): void {
  const escape = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const csv = [
    headers.map(escape).join(','),
    ...rows.map((r) => r.map(escape).join(',')),
  ].join('\n');
  // BOM (\uFEFF) keeps Excel happy with UTF-8 Arabic text
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
