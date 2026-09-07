import React from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import ChromicTabBar from '@/components/ChromicTabBar';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 1024;

  return (
    <Tabs
      tabBar={(props) => <ChromicTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
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
          title: 'Care',
        }}
      />
    </Tabs>
  );
}
