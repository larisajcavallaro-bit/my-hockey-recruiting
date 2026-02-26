/** Convert array of objects to CSV string */
export function toCSV<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T | string; label: string }[]
): string {
  if (rows.length === 0) {
    return columns.map((c) => c.label).join(",") + "\n";
  }
  const header = columns.map((c) => escapeCSV(String(c.label))).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = row[c.key as keyof T];
          if (Array.isArray(val)) return escapeCSV(val.join("; "));
          return escapeCSV(val == null ? "" : String(val));
        })
        .join(",")
    )
    .join("\n");
  return header + "\n" + body;
}

function escapeCSV(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/** Detect CSV delimiter from first line (comma, semicolon, or tab) */
function detectDelimiter(firstLine: string): string {
  const commas = (firstLine.match(/,/g) ?? []).length;
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  const tabs = (firstLine.match(/\t/g) ?? []).length;
  if (tabs >= commas && tabs >= semicolons && tabs > 0) return "\t";
  if (semicolons >= commas && semicolons > 0) return ";";
  return ",";
}

/** Parse CSV string to array of objects */
export function parseCSV(csv: string): Record<string, string>[] {
  // Strip BOM (Excel and other tools add this to UTF-8 files)
  const cleaned = csv.replace(/^\uFEFF/, "").trim();
  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const delimiter = detectDelimiter(lines[0]);
  const header = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, "").replace(/^\uFEFF/, ""));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    header.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((c === delimiter && !inQuotes) || c === "\n") {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

/** Trigger browser download of a file */
export function downloadFile(content: string, filename: string, mimeType = "text/csv") {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
