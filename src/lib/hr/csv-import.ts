/** Parse CSV text (RFC 4180: quoted fields, doubled quotes, CRLF or LF). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

/** Column names accepted in an employee import (case and spacing don't matter). */
const ALIASES: Record<string, string[]> = {
  firstName: ["first name", "firstname", "first_name", "given name"],
  lastName: ["last name", "lastname", "last_name", "surname"],
  email: ["email", "work email", "e-mail"],
  phone: ["phone", "phone number", "mobile"],
  staffNumber: ["staff number", "staff_number", "employee id", "employee_id", "staff id"],
  jobTitle: ["job title", "job_title", "designation", "position"],
  department: ["department"],
  location: ["duty station", "duty_station", "branch", "location"],
  startDate: ["start date", "start_date", "joined", "date joined"],
  status: ["status", "employee status"],
  managerEmail: ["line manager email", "manager email", "line_manager_email"],
};

export type ImportRow = Partial<Record<keyof typeof ALIASES, string>>;

/** Map CSV rows to employee fields using the header row. Unknown columns are ignored. */
export function mapEmployeeRows(rows: string[][]): { records: ImportRow[]; missingColumns: string[] } {
  const [header = [], ...body] = rows;
  const norm = (h: string) => h.trim().toLowerCase().replace(/\s+/g, " ");
  const index: Partial<Record<keyof typeof ALIASES, number>> = {};
  for (const [key, names] of Object.entries(ALIASES) as [keyof typeof ALIASES, string[]][]) {
    const i = header.findIndex((h) => names.includes(norm(h)));
    if (i >= 0) index[key] = i;
  }
  const missingColumns = (["firstName", "lastName"] as const).filter((k) => index[k] === undefined).map((k) => (k === "firstName" ? "First name" : "Last name"));
  const records = body.map((r) => Object.fromEntries(Object.entries(index).map(([k, i]) => [k, (r[i!] ?? "").trim()])) as ImportRow);
  return { records, missingColumns };
}

export const IMPORT_TEMPLATE = "First name,Last name,Email,Phone,Staff number,Job title,Department,Duty station,Start date,Status,Line manager email\r\n";
