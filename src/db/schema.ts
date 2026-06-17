import { getDatabase } from './database';

const CURRENT_VERSION = 1;

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id          TEXT PRIMARY KEY,
      qr_value    TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id              TEXT PRIMARY KEY,
      student_id      TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      date            TEXT NOT NULL,
      check_in_time   TEXT,
      check_out_time  TEXT,
      UNIQUE(student_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_logs_date ON attendance_logs(date);
    CREATE INDEX IF NOT EXISTS idx_logs_student ON attendance_logs(student_id);
  `);

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );

  if (!row) {
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [CURRENT_VERSION]);
  }
}
