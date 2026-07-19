import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import Constants from 'expo-constants';
import { useTheme } from '@/hooks/useTheme';

export default function TopFogOverlay({ height }: { height?: number }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.fog, 
        height ? { height } : undefined,
        { backgroundColor: isDark ? '#121212' : '#FDFDFD' }
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  fog: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Constants.statusBarHeight + 5,
    zIndex: 998,
  },
});
