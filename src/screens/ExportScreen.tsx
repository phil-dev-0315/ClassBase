import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExport } from '../hooks/useExport';
import { colors } from '../constants/colors';
import { spacing, radius, fontSize, fontWeight, shadow } from '../constants/theme';

export function ExportScreen() {
  const { fromDate, toDate, setFromDate, setToDate, loading, error, exportAttendance } = useExport();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Export</Text>
        <Text style={styles.subtitle}>Generate an Excel attendance report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.cardTitle}>📅 Date Range</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>From</Text>
              <TextInput
                style={styles.dateInput}
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <Text style={styles.dateSep}>→</Text>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>To</Text>
              <TextInput
                style={styles.dateInput}
                value={toDate}
                onChangeText={setToDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>
          <Text style={styles.hint}>Format: YYYY-MM-DD (e.g. 2025-06-01)</Text>
        </View>

        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.cardTitle}>📊 What's included</Text>
          <View style={styles.featureList}>
            {[
              'All students, one row per day',
              'Check-in and check-out times',
              'Status: Present / In Class / Absent',
              'Sorted by date, then student name',
            ].map((f) => (
              <View key={f} style={styles.featureItem}>
                <Text style={styles.featureDot}>•</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.exportBtn, loading && styles.exportBtnDisabled]}
          onPress={exportAttendance}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.exportIcon}>📤</Text>
              <Text style={styles.exportText}>Export to Excel</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          The file will open in your phone's share sheet. You can send it via email, save to Files, or share to any app.
        </Text>
      </ScrollView>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.headerText,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(248,250,252,0.6)',
    marginTop: 2,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  dateInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
  },
  dateSep: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  featureList: {
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  featureDot: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    fontWeight: fontWeight.medium,
  },
  exportBtn: {
    backgroundColor: colors.headerBg,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportIcon: {
    fontSize: fontSize.xl,
  },
  exportText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  footer: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingBottom: spacing.xl,
  },
});
