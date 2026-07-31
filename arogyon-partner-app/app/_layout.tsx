import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function PartnerRootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        <Stack.Screen name="dashboard/index" />
        <Stack.Screen name="content/index" />
        <Stack.Screen name="boost/index" />
        <Stack.Screen name="leads/index" />
        <Stack.Screen name="listings/index" />
        <Stack.Screen name="profile/index" />
      </Stack>
    </>
  );
}
