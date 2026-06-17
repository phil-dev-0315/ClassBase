import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAllStudents, updateStudentName, deleteStudent } from '../db/studentRepository';
import { colors } from '../constants/colors';
import { spacing, radius, fontSize, fontWeight } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Student } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function StudentDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { studentId } = route.params;

  const [student, setStudent] = useState<Student | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllStudents().then((all) => {
      const found = all.find((s) => s.id === studentId) ?? null;
      setStudent(found);
      setName(found?.name ?? '');
    });
  }, [studentId]);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || !student) return;
    setSaving(true);
    try {
      await updateStudentName(student.id, trimmed);
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!student) return;
    Alert.alert(
      'Remove Student',
      `Remove ${student.name} and all their attendance records? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteStudent(student.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  if (!student) return null;

  const isDirty = name.trim() !== student.name;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? '')
                  .join('')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Student name"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
          />

          <Text style={styles.sectionLabel}>QR Code Value</Text>
          <View style={styles.qrBox}>
            <Text style={styles.qrText}>{student.qrValue}</Text>
          </View>

          <Text style={styles.enrolledNote}>
            Enrolled {new Date(student.createdAt).toLocaleDateString()}
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Remove Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, (!isDirty || saving) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!isDirty || saving}
          >
            <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.sm },
  avatarWrap: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  qrBox: {
    backgroundColor: colors.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  qrText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  enrolledNote: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  saveBtn: {
    backgroundColor: colors.headerBg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  deleteBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.danger,
  },
});
