import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing, radius, fontSize, fontWeight } from '../constants/theme';
import type { DailyStatus } from '../types';

interface Props {
  item: DailyStatus;
}

const statusConfig = {
  present: { label: 'Present', color: colors.statusIn, bg: colors.statusInLight, icon: '✓' },
  partial: { label: 'In Class', color: colors.statusOut, bg: colors.statusOutLight, icon: '◑' },
  absent: { label: 'Absent', color: colors.statusAbsent, bg: colors.statusAbsentLight, icon: '✗' },
};

export function AttendanceRow({ item }: Props) {
  const { student, checkInTime, checkOutTime, status } = item;
  const cfg = statusConfig[status];

  const initials = student.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.avatarText, { color: cfg.color }]}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <View style={styles.times}>
          {checkInTime ? (
            <Text style={styles.timeIn}>IN {checkInTime}</Text>
          ) : null}
          {checkOutTime ? (
            <Text style={styles.timeOut}>OUT {checkOutTime}</Text>
          ) : null}
          {!checkInTime && !checkOutTime ? (
            <Text style={styles.noTime}>No scan today</Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  times: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  timeIn: {
    fontSize: fontSize.xs,
    color: colors.statusIn,
    fontWeight: fontWeight.medium,
  },
  timeOut: {
    fontSize: fontSize.xs,
    color: colors.statusOut,
    fontWeight: fontWeight.medium,
  },
  noTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
