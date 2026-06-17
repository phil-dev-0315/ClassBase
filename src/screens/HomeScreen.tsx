import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAttendance } from '../hooks/useAttendance';
import { SummaryCard } from '../components/SummaryCard';
import { AttendanceRow } from '../components/AttendanceRow';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../constants/colors';
import { spacing, fontSize, fontWeight } from '../constants/theme';
import { formatDisplayDate, formatDayOfWeek } from '../utils/dateUtils';
import type { DailyStatus } from '../types';

export function HomeScreen() {
  const { statuses, loading, counts, date, refresh } = useAttendance();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.dayLabel}>{formatDayOfWeek(date)}</Text>
        <Text style={styles.dateLabel}>{formatDisplayDate(date)}</Text>
      </View>

      <FlatList
        data={statuses}
        keyExtractor={(item) => item.student.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.cards}>
            <SummaryCard
              label="Present"
              count={counts.present}
              color={colors.statusIn}
              bgColor={colors.statusInLight}
              icon="✓"
            />
            <SummaryCard
              label="In Class"
              count={counts.partial}
              color={colors.statusOut}
              bgColor={colors.statusOutLight}
              icon="◑"
            />
            <SummaryCard
              label="Absent"
              count={counts.absent}
              color={colors.statusAbsent}
              bgColor={colors.statusAbsentLight}
              icon="✗"
            />
          </View>
        }
        ListHeaderComponentStyle={styles.listHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="🏫"
              title="No students yet"
              subtitle="Go to the Scanner tab to scan a student's QR keychain and enroll them."
            />
          ) : null
        }
        renderItem={({ item, index }: { item: DailyStatus; index: number }) => (
          <>
            {index === 0 && statuses.length > 0 && (
              <Text style={styles.sectionTitle}>Today's Roster</Text>
            )}
            <AttendanceRow item={item} />
            <View style={styles.divider} />
          </>
        )}
        contentContainerStyle={statuses.length === 0 ? styles.emptyContent : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  dayLabel: {
    fontSize: fontSize.sm,
    color: 'rgba(248,250,252,0.6)',
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateLabel: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.headerText,
    marginTop: 2,
  },
  listHeader: {
    backgroundColor: colors.background,
  },
  cards: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: spacing.md + 38 + spacing.sm,
  },
  emptyContent: {
    flex: 1,
  },
});
