import { useState } from 'react';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getAllStudents } from '../db/studentRepository';
import { getLogsForRange } from '../db/attendanceRepository';
import { buildExcelExport } from '../utils/exportUtils';
import { today } from '../utils/dateUtils';

export function useExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFrom = today().slice(0, 8) + '01';
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(today());

  async function exportAttendance() {
    if (fromDate > toDate) {
      setError('Start date must be before end date.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [students, logs] = await Promise.all([
        getAllStudents(),
        getLogsForRange(fromDate, toDate),
      ]);

      if (students.length === 0) {
        setError('No students registered yet.');
        return;
      }

      const { base64, filename } = buildExcelExport(students, logs, fromDate, toDate);

      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const file = new File(Paths.cache, filename);
      file.write(bytes);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        setError('Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Attendance',
        UTI: 'com.microsoft.excel.xlsx',
      });
    } catch (e) {
      setError('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    loading,
    error,
    exportAttendance,
  };
}
