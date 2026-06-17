import { format, parseISO, isValid } from 'date-fns';
import uuid from 'react-native-uuid';

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentTime(): string {
  return format(new Date(), 'HH:mm');
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMMM d, yyyy') : dateStr;
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMM d') : dateStr;
  } catch {
    return dateStr;
  }
}

export function formatDayOfWeek(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'EEEE') : '';
  } catch {
    return '';
  }
}

export function generateId(): string {
  return uuid.v4() as string;
}
