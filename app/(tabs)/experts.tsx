import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler, runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useTabBarStore } from '@/hooks/useTabBarStore';
import AnimatedScreen from '@/components/AnimatedScreen';
import ExpertCareModule from '@/components/ExpertCareModule';

export default function ExpertsScreen() {
  const { colors, isDark } = useTheme();
  const setTabBarVisible = useTabBarStore((s) => s.setTabBarVisible);

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      if (currentY > lastScrollY.value + 8 && currentY > 50) {
        runOnJS(setTabBarVisible)(false);
      } else if (currentY < lastScrollY.value - 6 || currentY <= 30) {
        runOnJS(setTabBarVisible)(true);
      }
      lastScrollY.value = currentY;
      scrollY.value = currentY;
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
    paddingBottom: Platform.OS === 'web' ? 40 : 140,
  },
});
