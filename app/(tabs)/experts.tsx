import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import ExpertCareModule from '@/components/ExpertCareModule';

export default function ExpertsScreen() {
  const { colors, isDark } = useTheme();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <AnimatedScreen entrance="up">
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Experts Module (Full Bleed Status Bar Banner + Framed Bento Grid + Arogyan Brand Footer) */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <ExpertCareModule
              colors={colors}
              isDark={isDark}
            />
          </Animated.View>
        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 120,
  },
});
