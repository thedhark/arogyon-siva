import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import ChromicTabBar from '@/components/ChromicTabBar';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <ChromicTabBar {...props} />}
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
        name="experts"
        options={{
          title: 'Experts',
        }}
      />
    </Tabs>
  );
}
