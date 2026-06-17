export type ScanMode = 'IN' | 'OUT';

export interface Student {
  id: string;
  qrValue: string;
  name: string;
  createdAt: string;
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface DailyStatus {
  student: Student;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'partial' | 'absent';
}

export interface ExportRow {
  Name: string;
  Date: string;
  'Check-In Time': string;
  'Check-Out Time': string;
  Status: 'Present' | 'Partial' | 'Absent';
}
