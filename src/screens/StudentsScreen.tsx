import React from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudents } from '../hooks/useStudents';
import { StudentRow } from '../components/StudentRow';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../constants/colors';
import { spacing, fontSize, fontWeight } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Student } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function StudentsScreen() {
  const { students, loading, refresh } = useStudents();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.count}>{students.length} enrolled</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
        }
        renderItem={({ item }: { item: Student }) => (
          <StudentRow
            student={item}
            onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="👤"
              title="No students yet"
              subtitle="Scan a student's QR keychain on the Scanner tab to enroll them."
            />
          ) : null
        }
        contentContainerStyle={students.length === 0 ? styles.emptyContent : undefined}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.headerText,
  },
  count: {
    fontSize: fontSize.sm,
    color: 'rgba(248,250,252,0.6)',
    fontWeight: fontWeight.medium,
    marginBottom: 3,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: spacing.md + 40 + spacing.md,
  },
  emptyContent: {
    flex: 1,
  },
});
