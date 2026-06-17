import { utils, write } from 'xlsx';
import type { Student, AttendanceLog, ExportRow } from '../types';
import { formatShortDate } from './dateUtils';

function deriveStatus(log: AttendanceLog | undefined): 'Present' | 'Partial' | 'Absent' {
  if (!log) return 'Absent';
  if (log.checkInTime && log.checkOutTime) return 'Present';
  if (log.checkInTime || log.checkOutTime) return 'Partial';
  return 'Absent';
}

export interface ExportResult {
  base64: string;
  filename: string;
}

export function buildExcelExport(
  students: Student[],
  logs: AttendanceLog[],
  from: string,
  to: string
): ExportResult {
  const logMap = new Map<string, AttendanceLog>();
  for (const log of logs) {
    logMap.set(`${log.studentId}:${log.date}`, log);
  }

  const dates = getDatesInRange(from, to);
  const rows: ExportRow[] = [];

  for (const date of dates) {
    const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    for (const student of sortedStudents) {
      const log = logMap.get(`${student.id}:${date}`);
      const status = deriveStatus(log);
      rows.push({
        Name: student.name,
        Date: date,
        'Check-In Time': log?.checkInTime ?? '—',
        'Check-Out Time': log?.checkOutTime ?? '—',
        Status: status,
      });
    }
  }

  const ws = utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 25 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
  ];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Attendance');

  const base64 = write(wb, { type: 'base64', bookType: 'xlsx' });

  const fromFormatted = from.replace(/-/g, '');
  const toFormatted = to.replace(/-/g, '');
  const filename = `classbase_${fromFormatted}_${toFormatted}.xlsx`;

  return { base64, filename };
}

function getDatesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const start = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  const cur = new Date(start);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}
