export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function csvEscape(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCSV<T>(rows: T[], columns: ExportColumn<T>[]): string {
  const header = columns.map((c) => csvEscape(c.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => csvEscape(c.value(row))).join(",")
  );
  return [header, ...lines].join("\r\n");
}

export async function toExcelBuffer<T>(
  rows: T[],
  columns: ExportColumn<T>[],
  sheetName = "Sheet1"
): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const data = rows.map((row) =>
    Object.fromEntries(columns.map((c) => [c.header, c.value(row)]))
  );
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
