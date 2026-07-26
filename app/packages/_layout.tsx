import React from 'react';
import { Stack } from 'expo-router';

export default function PackagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ headerShown: false }} />
      <Stack.Screen name="provider" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
    </Stack>
  );
}
