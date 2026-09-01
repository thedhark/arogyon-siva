import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function AddressesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    router.replace('/location');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  );
}
