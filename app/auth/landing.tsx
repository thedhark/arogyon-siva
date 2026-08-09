import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
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
import { ChevronDown, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_ITEMS = [
  {
    id: 1,
    titleUpper: "INDIA'S #1 HEALTHCARE",
    titleLower: "ECOSYSTEM",
    tagline: "Top Doctors · Instant Lab Tests · Digital Records",
  },
  {
    id: 2,
    titleUpper: "24/7 EXPERT DOCTOR",
    titleLower: "CONSULTATIONS",
    tagline: "Connect with verified specialists in under 10 minutes",
  },
  {
    id: 3,
    titleUpper: "NABL VERIFIED LABS",
    titleLower: "FREE HOME SAMPLE",
    tagline: "Accurate diagnostics delivered right to your doorstep",
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto advance carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/auth/verify');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'email') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (provider === 'email') {
      router.push('/auth/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  const currentItem = CAROUSEL_ITEMS[activeSlide];

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Top Hero Area with Light Green Background */}
        <View style={styles.topHeroSection}>
          <LinearGradient
            colors={isDark ? ['#081812', '#0C2D20', '#061912'] : ['#FFFFFF', '#F0FDF4', '#DCFCE7']}
            style={StyleSheet.absoluteFill}
          />

          {/* Top Bar with Skip Pill */}
          <View style={styles.topBar}>
            <View />
            <TouchableOpacity 
              style={[
                styles.skipButton,
                { 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(6, 78, 59, 0.1)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(6, 78, 59, 0.2)',
                }
              ]}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={[styles.skipText, { color: isDark ? '#FFFFFF' : '#064E3B' }]}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Headline Section */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.headlineContainer}>
            <Text style={[styles.mainHeadingUpper, { color: isDark ? '#F8FAFC' : '#064E3B' }]}>
              {currentItem.titleUpper}
            </Text>
            <Text style={[styles.mainHeadingLower, { color: isDark ? '#F8FAFC' : '#064E3B' }]}>
              {currentItem.titleLower}
            </Text>

            {/* Brand Highlight Badge */}
            <View style={styles.brandBadgeContainer}>
              <View style={styles.brandBadgeBrush}>
                <Text style={styles.brandBadgeText}>arogyon</Text>
              </View>
            </View>
          </Animated.View>

          {/* Free-Floating Reaching Hands Image Stretched Edge-to-Edge */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.freeHeroVisualWrapper}>
            <Image
              source={require('@/assets/images/onboarding_hands.png')}
              style={styles.freeFullWidthImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Carousel Pagination Dots Indicator */}
          <View style={styles.paginationRow}>
            {CAROUSEL_ITEMS.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveSlide(idx);
                }}
                style={[
                  styles.dot,
                  activeSlide === idx 
                    ? [styles.activeDotBar, { backgroundColor: isDark ? '#FFFFFF' : '#10B981' }] 
                    : [styles.inactiveDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(16,185,129,0.25)' }],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bottom Drawer Card (Login / Sign Up Drawer) */}
        <Animated.View 
          entering={FadeInUp.delay(300)} 
          style={[
            styles.bottomSheet,
            { backgroundColor: isDark ? '#141E28' : '#FFFFFF' }
          ]}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.bottomSheetContent}
          >
            {/* Drawer Title */}
            <Text style={[styles.drawerTitle, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
              Log in or sign up
            </Text>

            {/* Zomato-Style Phone Input Row (Separate Flag & Phone Box) */}
            <View style={styles.phoneRowContainer}>
              {/* Left Country Picker Button */}
              <TouchableOpacity 
                style={[
                  styles.countryPickerBtn,
                  { 
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0'
                  }
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <ChevronDown size={14} color={isDark ? '#94A3B8' : '#64748B'} style={styles.caretIcon} />
              </TouchableOpacity>

              {/* Right Phone Input Box */}
              <View 
                style={[
                  styles.phoneInputBox,
                  { 
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0'
                  }
                ]}
              >
                <Text style={[styles.codePrefix, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  +91
                </Text>
                <TextInput
                  style={[styles.phoneInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            {/* Primary Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueBtn,
                {
                  backgroundColor: phoneNumber.length >= 10 
                    ? '#10B981' 
                    : (isDark ? 'rgba(16, 185, 129, 0.35)' : '#A7F3D0'),
                }
              ]}
              onPress={handlePhoneSubmit}
              disabled={phoneNumber.length < 10}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>

            {/* Social Options Row (3 Icons: Google, Apple, Mail) */}
            <View style={styles.socialIconsRow}>
              {/* Google Button */}
              <TouchableOpacity
                style={[
                  styles.socialCircleBtn,
                  { 
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#F1F5F9' 
                  }
                ]}
                onPress={() => handleSocialLogin('google')}
                activeOpacity={0.8}
              >
                <View style={styles.googleIconBadge}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity
                style={[
                  styles.socialCircleBtn,
                  { 
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#F1F5F9' 
                  }
                ]}
                onPress={() => handleSocialLogin('apple')}
                activeOpacity={0.8}
              >
                <Text style={[styles.appleIconText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}></Text>
              </TouchableOpacity>

              {/* Email / Mail Button */}
              <TouchableOpacity
                style={[
                  styles.socialCircleBtn,
                  { 
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#F1F5F9' 
                  }
                ]}
                onPress={() => handleSocialLogin('email')}
                activeOpacity={0.8}
              >
                <Mail size={20} color="#10B981" />
              </TouchableOpacity>
            </View>

            {/* Footer Terms & Legal Disclaimer */}
            <View style={styles.legalFooter}>
              <Text style={[styles.legalText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                By continuing, you agree to our
              </Text>
              <View style={styles.legalLinksRow}>
                <TouchableOpacity onPress={() => router.push('/auth/onboarding')}>
                  <Text style={[styles.legalLink, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.legalDot, { color: isDark ? '#64748B' : '#94A3B8' }]}> · </Text>
                <TouchableOpacity onPress={() => router.push('/auth/onboarding')}>
                  <Text style={[styles.legalLink, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.legalDot, { color: isDark ? '#64748B' : '#94A3B8' }]}> · </Text>
                <TouchableOpacity onPress={() => router.push('/auth/onboarding')}>
                  <Text style={[styles.legalLink, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Content Policies
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  topHeroSection: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 40,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  headlineContainer: {
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  mainHeadingUpper: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  mainHeadingLower: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  brandBadgeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  brandBadgeBrush: {
    backgroundColor: '#10B981',
    paddingHorizontal: 22,
    paddingVertical: 5,
    borderRadius: 10,
    transform: [{ rotate: '-1.5deg' }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontStyle: 'italic',
  },
  freeHeroVisualWrapper: {
    width: SCREEN_WIDTH,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    overflow: 'hidden',
  },
  freeFullWidthImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDotBar: {
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  bottomSheetContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  countryPickerBtn: {
    width: 72,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  flagEmoji: {
    fontSize: 20,
  },
  caretIcon: {
    marginLeft: 4,
  },
  phoneInputBox: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  codePrefix: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  continueBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
  },
  socialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
    marginBottom: 22,
  },
  socialCircleBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  appleIconText: {
    fontSize: 22,
    fontWeight: '700',
  },
  legalFooter: {
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11.5,
    marginBottom: 4,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legalLink: {
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: 11,
  },
});
