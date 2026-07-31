import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Phone,
  ArrowRight,
  ChevronRight,
  Globe,
  Activity,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/auth/verify');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)');
  };

  const handleGuestAccess = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LinearGradient
          colors={
            isDark
              ? ['#0A121A', '#0F1A24', '#060B10']
              : ['#ECFDF5', '#F0FDF4', '#FFFFFF']
          }
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Hero Banner */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.heroSection}>
            <View style={styles.brandBadgeRow}>
              <View style={[styles.brandIconCircle, { backgroundColor: '#10B981' }]}>
                <Activity size={24} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View style={[styles.livePill, { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#D1FAE5' }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>India's Premium Healthcare</Text>
              </View>
            </View>

            <Text style={[styles.brandTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Arogyon
            </Text>
            <Text style={[styles.tagline, { color: isDark ? '#94A3B8' : '#475569' }]}>
              Your complete digital health ecosystem. Book top doctors, lab tests, and track records seamlessly.
            </Text>

            {/* Feature Highlights Pill Badges */}
            <View style={styles.featuresRow}>
              <View style={[styles.featurePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF' }]}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={[styles.featureText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  ABDM Verified
                </Text>
              </View>
              <View style={[styles.featurePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF' }]}>
                <Sparkles size={14} color="#F59E0B" />
                <Text style={[styles.featureText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  AI Assistant
                </Text>
              </View>
              <View style={[styles.featurePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF' }]}>
                <CheckCircle2 size={14} color="#3B82F6" />
                <Text style={[styles.featureText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  Instant Video Call
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Unified Onboarding & Get Started Card */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.cardContainer}>
            <View
              style={[
                styles.glassCard,
                {
                  backgroundColor: isDark ? '#141E26' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.cardHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Get Started
              </Text>
              <Text style={[styles.cardHeaderSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Enter your phone number to sign in or create an account
              </Text>

              {/* Mobile Input Field (+91 India Format) */}
              <View
                style={[
                  styles.phoneInputWrapper,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.flagBox}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={[styles.countryCodeText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    +91
                  </Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                {phoneNumber.length >= 10 && (
                  <Pressable
                    style={styles.inlineGoBtn}
                    onPress={handlePhoneSubmit}
                  >
                    <ArrowRight size={18} color="#FFFFFF" />
                  </Pressable>
                )}
              </View>

              {/* Primary Phone Continue Action */}
              <Pressable
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor:
                      phoneNumber.length >= 10
                        ? '#10B981'
                        : isDark
                        ? '#1E293B'
                        : '#E2E8F0',
                  },
                ]}
                onPress={handlePhoneSubmit}
                disabled={phoneNumber.length < 10}
              >
                <Phone size={18} color={phoneNumber.length >= 10 ? '#FFFFFF' : '#94A3B8'} />
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      color:
                        phoneNumber.length >= 10
                          ? '#FFFFFF'
                          : isDark
                          ? '#64748B'
                          : '#94A3B8',
                    },
                  ]}
                >
                  Continue with Mobile Number
                </Text>
                <ChevronRight
                  size={18}
                  color={phoneNumber.length >= 10 ? '#FFFFFF' : '#94A3B8'}
                />
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
                <Text style={[styles.dividerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                  OR SIGN IN WITH
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
              </View>

              {/* Platform Social Login Options */}
              <View style={styles.socialButtonsRow}>
                {/* Google Sign In (Android / Universal) */}
                <Pressable
                  style={[
                    styles.socialBtn,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => handleSocialLogin('google')}
                >
                  <View style={styles.googleIconBadge}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                  <Text style={[styles.socialBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Google
                  </Text>
                </Pressable>

                {/* Apple Sign In (iOS) */}
                {Platform.OS === 'ios' && (
                  <Pressable
                    style={[
                      styles.socialBtn,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#000000',
                        borderColor: isDark ? '#334155' : '#000000',
                      },
                    ]}
                    onPress={() => handleSocialLogin('apple')}
                  >
                    <Text style={styles.appleIconText}></Text>
                    <Text style={[styles.socialBtnText, { color: '#FFFFFF' }]}>
                      Apple
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Guest / Direct Explorer Option */}
              <Pressable
                style={styles.guestLink}
                onPress={handleGuestAccess}
              >
                <Text style={[styles.guestLinkText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Explore App as Guest
                </Text>
                <ArrowRight size={14} color={isDark ? '#94A3B8' : '#64748B'} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Bottom Legal Note */}
          <Animated.View entering={FadeInUp.delay(350)} style={styles.footerNote}>
            <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              By proceeding, you agree to Arogyon's Terms of Service & Privacy Policy.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  brandIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14.5,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  featureText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  cardContainer: {
    width: '100%',
  },
  glassCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardHeaderSub: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 20,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  inlineGoBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 27,
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    gap: 8,
  },
  googleIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  appleIconText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  guestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  guestLinkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerNote: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 18,
  },
});
