import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import MaterialTabBar from '@/components/MaterialTabBar';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <MaterialTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="package"
        options={{
          title: 'Package',
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: 'Care',
        }}
      />
    </Tabs>
  );
}
