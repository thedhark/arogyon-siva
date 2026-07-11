import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

export default function TopFogOverlay() {
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={[
        isDark ? 'rgba(18,18,18,1)' : '#FDFDFD',
        isDark ? 'rgba(18,18,18,0.85)' : 'rgba(253,253,253,0.85)',
        isDark ? 'rgba(18,18,18,0)' : 'rgba(253,253,253,0)'
      ]}
      locations={[0, 0.6, 1]}
      style={styles.fog}
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
    height: Platform.OS === 'ios' ? 100 : 80,
    zIndex: 998,
  },
});
