import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue, FadeInUp, runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

import AnimatedScreen from '@/components/AnimatedScreen';
import PlanHeroHeader from '@/components/plan/PlanHeroHeader';
import PlanHeroNav from '@/components/plan/PlanHeroNav';
import PlanMetricsBanner from '@/components/plan/PlanMetricsBanner';
import PlanWorkflowTimeline from '@/components/plan/PlanWorkflowTimeline';
import PlanStickyFooter from '@/components/plan/PlanStickyFooter';

const HEADER_HEIGHT = 280; // Match hospital page header height

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      scrollY.value = currentY;
      const delta = currentY - prevScrollY.value;

      if (currentY <= 30) {
        runOnJS(setIsFooterVisible)(true);
      } else if (delta > 12 && currentY > 50) {
        runOnJS(setIsFooterVisible)(false);
      } else if (delta < -12) {
        runOnJS(setIsFooterVisible)(true);
      }
      prevScrollY.value = currentY;
    },
  });

  return (
    <AnimatedScreen entrance="fade" style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* 
        We render the Hero Header *outside* the ScrollView to allow it to be positioned absolutely
        and let the ScrollView scroll *over* or *behind* it depending on parallax math.
      */}
      <PlanHeroHeader 
        scrollY={scrollY}
        image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"
        title="Knee Recovery Plan"
        subtitle="45 Days Plan"
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.scrollContent]}
      >
        <View style={styles.contentSpacer} />

        {/* Content Area */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={[styles.contentBody, { backgroundColor: colors.background }]}
        >
          {/* Trust Metrics Overlapping Hero */}
          <PlanMetricsBanner />

          {/* End to End Workflow Timeline */}
          <Animated.View entering={FadeInUp.delay(300)}>
            <PlanWorkflowTimeline />
          </Animated.View>
          
          <View style={styles.bottomSpacer} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Header Actions (Rendered last to sit on top of everything) */}
      <PlanHeroNav scrollY={scrollY} title="Knee Recovery Plan" />

      {/* Sticky Bottom Pricing & Checkout */}
      <PlanStickyFooter 
        price="₹1,999" 
        subtitle="One time payment"
        onSubscribe={() => router.push('/booking/checkout')}
        visible={isFooterVisible}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000', // Black background for the overscroll at the top
  },
  scrollContent: {
    // Background color applied here and in contentBody
  },
  contentSpacer: {
    height: HEADER_HEIGHT, // Let the content start exactly after the image
  },
  contentBody: {
    minHeight: 1000,
  },
  textSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 120, // Space for the sticky footer
  }
});
