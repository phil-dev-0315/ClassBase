import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { ModeToggle } from '../components/ModeToggle';
import { RegisterModal } from '../components/RegisterModal';
import { getStudentByQr, insertStudent } from '../db/studentRepository';
import { getOrCreateLog, setCheckIn, setCheckOut } from '../db/attendanceRepository';
import { today, currentTime, generateId } from '../utils/dateUtils';
import { colors } from '../constants/colors';
import { spacing, radius, fontSize, fontWeight } from '../constants/theme';
import type { ScanMode } from '../types';

interface Toast {
  name: string;
  mode: ScanMode;
  time: string;
}

export function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>('IN');
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingQr, setPendingQr] = useState<string | null>(null);

  const isFrozenRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((name: string, scanMode: ScanMode, time: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ name, mode: scanMode, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (isFrozenRef.current) return;
      isFrozenRef.current = true;

      try {
        const student = await getStudentByQr(data);

        if (!student) {
          setPendingQr(data);
          return;
        }

        const date = today();
        const time = currentTime();
        const log = await getOrCreateLog(student.id, date);

        if (mode === 'IN') {
          if (log.checkInTime) {
            Alert.alert('Already Scanned', `${student.name} was already checked IN today.`);
            return;
          }
          await setCheckIn(student.id, date, time);
        } else {
          if (log.checkOutTime) {
            Alert.alert('Already Scanned', `${student.name} was already checked OUT today.`);
            return;
          }
          await setCheckOut(student.id, date, time);
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast(student.name, mode, time);
      } catch {
        Alert.alert('Error', 'Could not process scan. Please try again.');
      } finally {
        setTimeout(() => { isFrozenRef.current = false; }, 1500);
      }
    },
    [mode, showToast]
  );

  const handleRegister = useCallback(
    async (name: string) => {
      if (!pendingQr) return;
      try {
        const newStudent = {
          id: generateId(),
          qrValue: pendingQr,
          name,
          createdAt: new Date().toISOString(),
        };
        await insertStudent(newStudent);

        const date = today();
        const time = currentTime();

        if (mode === 'IN') {
          await setCheckIn(newStudent.id, date, time);
        } else {
          await setCheckOut(newStudent.id, date, time);
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast(name, mode, time);
      } catch {
        Alert.alert('Error', 'Could not enroll student.');
      } finally {
        setPendingQr(null);
        setTimeout(() => { isFrozenRef.current = false; }, 1500);
      }
    },
    [pendingQr, mode, showToast]
  );

  const handleCancelRegister = useCallback(() => {
    setPendingQr(null);
    setTimeout(() => { isFrozenRef.current = false; }, 500);
  }, []);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Checking camera access…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.permIcon}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Needed</Text>
        <Text style={styles.permSubtitle}>
          ClassBase needs your camera to scan student QR keychains.
        </Text>
        {permission.canAskAgain ? (
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Grant Access</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.permBtn} onPress={() => Linking.openSettings()}>
            <Text style={styles.permBtnText}>Open Settings</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={pendingQr ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Text style={styles.topLabel}>Scan QR Keychain</Text>
          <ModeToggle mode={mode} onChange={setMode} />
        </View>

        <View style={styles.frameArea}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
          <Text style={styles.frameHint}>Point at student's QR keychain</Text>
        </View>

        {toast && (
          <View style={[styles.toast, toast.mode === 'IN' ? styles.toastIn : styles.toastOut]}>
            <Text style={styles.toastName}>{toast.name}</Text>
            <Text style={styles.toastDetail}>
              {toast.mode} at {toast.time}
            </Text>
          </View>
        )}
      </SafeAreaView>

      <RegisterModal
        visible={pendingQr !== null}
        qrValue={pendingQr ?? ''}
        onSave={handleRegister}
        onCancel={handleCancelRegister}
      />
    </View>
  );
}

const FRAME = 240;
const CORNER = 24;
const BORDER = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topLabel: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  frameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  frame: {
    width: FRAME,
    height: FRAME,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.white,
  },
  tl: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderTopLeftRadius: 6 },
  tr: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER, borderTopRightRadius: 6 },
  bl: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER, borderBottomLeftRadius: 6 },
  br: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderBottomRightRadius: 6 },
  frameHint: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  toast: {
    margin: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  toastIn: {
    backgroundColor: colors.statusIn,
  },
  toastOut: {
    backgroundColor: colors.primary,
  },
  toastName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  toastDetail: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  permIcon: { fontSize: 52 },
  permTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  permSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  permText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  permBtn: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  permBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
});
