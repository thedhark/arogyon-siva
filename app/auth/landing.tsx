import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AuthFormDrawer from '@/components/auth/AuthFormDrawer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_SLIDES = [
  {
    id: 1,
    titleUpper: "INDIA'S #1 HEALTHCARE",
    titleLower: "ECOSYSTEM",
  },
  {
    id: 2,
    titleUpper: "24/7 EXPERT DOCTOR",
    titleLower: "CONSULTATIONS",
  },
  {
    id: 3,
    titleUpper: "NABL VERIFIED LABS",
    titleLower: "FREE HOME SAMPLE",
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Top Hero Visual */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={isDark ? ['#081812', '#0C2D20', '#061912'] : ['#FFFFFF', '#F0FDF4', '#DCFCE7']}
            style={StyleSheet.absoluteFill}
          />

          {/* Top Skip Pill */}
          <View style={styles.topBar}>
            <View />
            <TouchableOpacity
              style={[
                styles.skipBtn,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(6, 78, 59, 0.1)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(6, 78, 59, 0.2)',
                },
              ]}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={[styles.skipText, { color: isDark ? '#FFFFFF' : '#064E3B' }]}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Headline */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.headArea}>
            <Text style={[styles.heading, { color: isDark ? '#F8FAFC' : '#064E3B' }]}>
              {currentSlide.titleUpper}
            </Text>
            <Text style={[styles.heading, { color: isDark ? '#F8FAFC' : '#064E3B' }]}>
              {currentSlide.titleLower}
            </Text>
            <View style={styles.badgeWrap}>
              <View style={styles.badgeBrush}>
                <Text style={styles.badgeText}>arogyon</Text>
              </View>
            </View>
          </Animated.View>

          {/* Image */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.imageWrap}>
            <Image
              source={require('@/assets/images/onboarding_hands.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Slide Dots */}
          <View style={styles.dotRow}>
            {HERO_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  activeSlide === idx
                    ? [styles.activeDot, { backgroundColor: isDark ? '#FFFFFF' : '#10B981' }]
                    : [styles.inactiveDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(16,185,129,0.25)' }],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bottom Drawer Card */}
        <Animated.View
          entering={FadeInUp.delay(300)}
          style={[
            styles.bottomSheet,
            { backgroundColor: isDark ? '#141E28' : '#FFFFFF' },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.drawerContent}
          >
            <AuthFormDrawer />

            {/* Terms Footer */}
            <Text style={[styles.legalText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFDF5',
  },
  heroSection: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 38,
  },
  skipBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  badgeWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  badgeBrush: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '-1.5deg' }],
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontStyle: 'italic',
  },
  imageWrap: {
    width: SCREEN_WIDTH,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },
  activeDot: {
    width: 22,
  },
  inactiveDot: {
    width: 5,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11.5,
    marginTop: 4,
    textAlign: 'center',
  },
});
