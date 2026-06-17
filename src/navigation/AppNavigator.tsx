import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { StudentsScreen } from '../screens/StudentsScreen';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { ExportScreen } from '../screens/ExportScreen';
import { colors } from '../constants/colors';
import { fontSize, fontWeight } from '../constants/theme';

export type RootStackParamList = {
  Tabs: undefined;
  StudentDetail: { studentId: string };
};

export type TabParamList = {
  Home: undefined;
  Scanner: undefined;
  Students: undefined;
  Export: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.headerBg,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Export"
        component={ExportScreen}
        options={{
          tabBarLabel: 'Export',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{
          title: 'Student Info',
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontWeight: fontWeight.bold },
        }}
      />
    </Stack.Navigator>
  );
}
