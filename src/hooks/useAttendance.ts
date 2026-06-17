import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAllStudents } from '../db/studentRepository';
import { getLogsForDate } from '../db/attendanceRepository';
import { today } from '../utils/dateUtils';
import type { DailyStatus } from '../types';

export function useAttendance() {
  const [statuses, setStatuses] = useState<DailyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [date] = useState(today());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [students, logs] = await Promise.all([
        getAllStudents(),
        getLogsForDate(date),
      ]);
      const logMap = new Map(logs.map((l) => [l.studentId, l]));

      const result: DailyStatus[] = students.map((student) => {
        const log = logMap.get(student.id);
        const checkInTime = log?.checkInTime ?? null;
        const checkOutTime = log?.checkOutTime ?? null;
        let status: DailyStatus['status'] = 'absent';
        if (checkInTime && checkOutTime) status = 'present';
        else if (checkInTime || checkOutTime) status = 'partial';
        return { student, checkInTime, checkOutTime, status };
      });

      result.sort((a, b) => {
        const order = { present: 0, partial: 1, absent: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return a.student.name.localeCompare(b.student.name);
      });

      setStatuses(result);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const counts = {
    present: statuses.filter((s) => s.status === 'present').length,
    partial: statuses.filter((s) => s.status === 'partial').length,
    absent: statuses.filter((s) => s.status === 'absent').length,
    total: statuses.length,
  };

  return { statuses, loading, counts, date, refresh };
}
