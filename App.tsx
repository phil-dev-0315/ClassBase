import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { runMigrations } from './src/db/schema';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/constants/colors';
import { fontSize, fontWeight } from './src/constants/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runMigrations()
      .then(() => setReady(true))
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashError}>Failed to initialize database.{'\n'}{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>🏫</Text>
        <Text style={styles.splashTitle}>ClassBase</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  splashLogo: {
    fontSize: 64,
  },
  splashTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.headerText,
    letterSpacing: 1,
  },
  splashError: {
    fontSize: fontSize.sm,
    color: colors.statusAbsent,
    textAlign: 'center',
    padding: 24,
  },
});
