import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import Constants from 'expo-constants';
import { useTheme } from '@/hooks/useTheme';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopFogOverlayProps {
  height?: number;
  scrollY?: SharedValue<number>;
  triggerPoint?: number;
}

export default function TopFogOverlay({ height, scrollY, triggerPoint }: TopFogOverlayProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const supportsLiquidGlass = isLiquidGlassAvailable();
  
  // Use safe area top inset if available, otherwise fallback to Constants.statusBarHeight
  const statusBarHeight = insets.top > 0 ? insets.top : Constants.statusBarHeight;
  const fogHeight = height ?? (statusBarHeight + 20);

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1 };
    }

    if (triggerPoint !== undefined) {
      // Fade in over a 50px range just before reaching the trigger point
      const opacity = interpolate(
        scrollY.value,
        [triggerPoint - 50, triggerPoint],
        [0, 1],
        Extrapolation.CLAMP
      );
      return { opacity };
    } else {
      // Default fallback: fade in over first 50px of scroll
      const opacity = interpolate(
        scrollY.value,
        [0, 50],
        [0, 1],
        Extrapolation.CLAMP
      );
      return { opacity };
    }
  });

  return (
    <Animated.View
      style={[
        styles.fog, 
        { height: fogHeight },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      {/* Base Glass/Blur layer matching the footer material */}
      {supportsLiquidGlass && (
        <GlassView glassEffectStyle="regular" isInteractive={false} style={StyleSheet.absoluteFill} />
      )}
      {!supportsLiquidGlass && Platform.OS === 'ios' && (
        <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      )}
      {!supportsLiquidGlass && Platform.OS !== 'ios' && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]} />
      )}

      {/* Smooth Fading Fog Gradient */}
      <LinearGradient
        colors={[
          isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(253, 253, 253, 0.95)',
          isDark ? 'rgba(18, 18, 18, 0.6)' : 'rgba(253, 253, 253, 0.6)',
          isDark ? 'rgba(18, 18, 18, 0)' : 'rgba(253, 253, 253, 0)'
        ]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fog: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
  },
});
