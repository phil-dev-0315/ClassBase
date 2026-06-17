import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { radius, fontSize, fontWeight, spacing } from '../constants/theme';
import type { ScanMode } from '../types';

interface Props {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pill, mode === 'IN' && styles.pillActiveIn]}
        onPress={() => onChange('IN')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, mode === 'IN' && styles.labelActive]}>IN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.pill, mode === 'OUT' && styles.pillActiveOut]}
        onPress={() => onChange('OUT')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, mode === 'OUT' && styles.labelActive]}>OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: radius.full,
    padding: 3,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  pillActiveIn: {
    backgroundColor: colors.modeIn,
  },
  pillActiveOut: {
    backgroundColor: colors.modeOut,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  labelActive: {
    color: colors.white,
  },
});
