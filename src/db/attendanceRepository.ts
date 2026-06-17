import { getDatabase } from './database';
import type { AttendanceLog } from '../types';
import { generateId } from '../utils/dateUtils';

interface LogRow {
  id: string;
  student_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
}

function rowToLog(row: LogRow): AttendanceLog {
  return {
    id: row.id,
    studentId: row.student_id,
    date: row.date,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
  };
}

export async function getOrCreateLog(studentId: string, date: string): Promise<AttendanceLog> {
  const db = await getDatabase();
  let row = await db.getFirstAsync<LogRow>(
    'SELECT * FROM attendance_logs WHERE student_id = ? AND date = ?',
    [studentId, date]
  );
  if (!row) {
    const id = generateId();
    await db.runAsync(
      'INSERT OR IGNORE INTO attendance_logs (id, student_id, date, check_in_time, check_out_time) VALUES (?, ?, ?, NULL, NULL)',
      [id, studentId, date]
    );
    row = await db.getFirstAsync<LogRow>(
      'SELECT * FROM attendance_logs WHERE student_id = ? AND date = ?',
      [studentId, date]
    );
  }
  return rowToLog(row!);
}

export async function setCheckIn(studentId: string, date: string, time: string): Promise<void> {
  await getOrCreateLog(studentId, date);
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE attendance_logs SET check_in_time = ? WHERE student_id = ? AND date = ?',
    [time, studentId, date]
  );
}

export async function setCheckOut(studentId: string, date: string, time: string): Promise<void> {
  await getOrCreateLog(studentId, date);
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE attendance_logs SET check_out_time = ? WHERE student_id = ? AND date = ?',
    [time, studentId, date]
  );
}

export async function getLogsForDate(date: string): Promise<AttendanceLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<LogRow>(
    'SELECT * FROM attendance_logs WHERE date = ?',
    [date]
  );
  return rows.map(rowToLog);
}

export async function getLogsForRange(from: string, to: string): Promise<AttendanceLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<LogRow>(
    'SELECT * FROM attendance_logs WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [from, to]
  );
  return rows.map(rowToLog);
}
