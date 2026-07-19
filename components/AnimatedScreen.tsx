import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

type Entrance = 'fade' | 'up' | 'down';

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Entrance animation preset */
  entrance?: Entrance;
  delay?: number;
}

/**
 * Wraps screen content with a consistent entrance animation.
 * Use on stack screens for a cohesive end-to-end feel.
 */
export default function AnimatedScreen({
  children,
  style,
  entrance = 'up',
  delay = 0,
}: AnimatedScreenProps) {
  const entering =
    entrance === 'fade'
      ? FadeIn.delay(delay).duration(400)
      : entrance === 'down'
        ? FadeInDown.delay(delay).duration(400)
        : FadeInUp.delay(delay).duration(400);

  return (
    <Animated.View entering={entering} style={[styles.root, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
