import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import Animated from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export interface AndroidGlassViewProps extends BlurViewProps {
  animatedProps?: any;
  isInteractive?: boolean;
}

export default function AndroidGlassView({ 
  intensity = 85, 
  tint,
  style, 
  animatedProps,
  ...rest 
}: AndroidGlassViewProps) {
  const { isDark } = useTheme();
  // Delay mounting to prevent "software rendering doesn't support hardware bitmaps" 
  // crash during Expo Fast Refresh/Hot Reload.
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timeout);
  }, []);
  
  if (Platform.OS !== 'android') {
    return null; // Ensure this only renders on Android
  }

  if (!isReady) {
    // Return a solid fallback during the 150ms reload window to prevent the hardware crash
    return (
      <Animated.View 
        style={[style, { backgroundColor: isDark ? 'rgba(18,18,18,0.85)' : 'rgba(253,253,253,0.85)' }]} 
      />
    );
  }

  return (
    <AnimatedBlurView 
      animatedProps={animatedProps}
      intensity={intensity}
      tint={tint || (isDark ? 'dark' : 'light')}
      experimentalBlurMethod="dimezisBlurView"
      style={[StyleSheet.absoluteFill, style]}
      {...rest}
    />
  );
}
