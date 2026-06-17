import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAllStudents } from '../db/studentRepository';
import type { Student } from '../types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { students, loading, refresh };
}
