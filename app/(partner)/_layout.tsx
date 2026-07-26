import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function PartnerLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="content/index" />
      <Stack.Screen name="boost/index" />
      <Stack.Screen name="listings/index" />
      <Stack.Screen name="leads/index" />
      <Stack.Screen name="profile/index" />
    </Stack>
  );
}
