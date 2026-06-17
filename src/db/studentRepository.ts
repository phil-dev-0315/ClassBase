import { getDatabase } from './database';
import type { Student } from '../types';

interface StudentRow {
  id: string;
  qr_value: string;
  name: string;
  created_at: string;
}

function rowToStudent(row: StudentRow): Student {
  return {
    id: row.id,
    qrValue: row.qr_value,
    name: row.name,
    createdAt: row.created_at,
  };
}

export async function getAllStudents(): Promise<Student[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<StudentRow>(
    'SELECT * FROM students ORDER BY name ASC'
  );
  return rows.map(rowToStudent);
}

export async function getStudentByQr(qrValue: string): Promise<Student | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<StudentRow>(
    'SELECT * FROM students WHERE qr_value = ?',
    [qrValue]
  );
  return row ? rowToStudent(row) : null;
}

export async function insertStudent(student: Student): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO students (id, qr_value, name, created_at) VALUES (?, ?, ?, ?)',
    [student.id, student.qrValue, student.name, student.createdAt]
  );
}

export async function updateStudentName(id: string, name: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE students SET name = ? WHERE id = ?', [name, id]);
}

export async function deleteStudent(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM students WHERE id = ?', [id]);
}
