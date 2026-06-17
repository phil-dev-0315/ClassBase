import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing, radius, fontSize, fontWeight, shadow } from '../constants/theme';

interface Props {
  label: string;
  count: number;
  color: string;
  bgColor: string;
  icon: string;
}

export function SummaryCard({ label, count, color, bgColor, icon }: Props) {
  return (
    <View style={[styles.card, { borderTopColor: color }, shadow.sm]}>
      <View style={[styles.iconBadge, { backgroundColor: bgColor }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.count, { color }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderTopWidth: 3,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  count: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: 38,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
