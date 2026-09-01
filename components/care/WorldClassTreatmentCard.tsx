import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Building2, Clock, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WorldClassTreatmentCardProps {
  onPress?: () => void;
}

export default function WorldClassTreatmentCard({ onPress }: WorldClassTreatmentCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    if (onPress) {
      onPress();
    } else {
      router.push('/care/international' as any);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.outerCardWrapper,
        pressed && Platform.OS === 'ios' && { transform: [{ scale: 0.985 }], opacity: 0.95 },
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      onPress={handlePress}
    >
      <View
        style={[
          styles.innerCard,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.95)',
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
          },
        ]}
      >
        {/* Background Ultra-Realistic Photo */}
        <Image
          source={require('@/assets/images/intl_patient_hero_realistic.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Top spacer */}
        <View style={{ flex: 1 }} />

        {/* Bottom Floating Pristine Glass Capsule with 4 Features */}
        <View style={styles.bottomCapsuleWrap}>
          <View
            style={[
              styles.capsuleInner,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.95)',
              },
            ]}
          >
            {Platform.OS === 'ios' && (
              <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
            )}

            {/* Feature 1: Complete Support */}
            <View style={styles.featureCol}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
                <ShieldCheck size={18} color={isDark ? '#34D399' : '#059669'} strokeWidth={2.4} />
              </View>
              <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Complete{'\n'}Support
              </Text>
              <Text style={[styles.featureSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                End-to-end support at every step.
              </Text>
            </View>

            {/* Vertical Divider */}
            <View style={[styles.vDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }]} />

            {/* Feature 2: Top Hospitals */}
            <View style={styles.featureCol}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
                <Building2 size={18} color={isDark ? '#34D399' : '#059669'} strokeWidth={2.4} />
              </View>
              <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Top{'\n'}Hospitals
              </Text>
              <Text style={[styles.featureSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Access to India's leading hospitals.
              </Text>
            </View>

            {/* Vertical Divider */}
            <View style={[styles.vDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }]} />

            {/* Feature 3: 24/7 Assistance */}
            <View style={styles.featureCol}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
                <Clock size={18} color={isDark ? '#34D399' : '#059669'} strokeWidth={2.4} />
              </View>
              <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                24/7{'\n'}Assistance
              </Text>
              <Text style={[styles.featureSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                We're with you, always.
              </Text>
            </View>

            {/* Vertical Divider */}
            <View style={[styles.vDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }]} />

            {/* Feature 4: Visa Assistance */}
            <View style={styles.featureCol}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
                <Globe size={18} color={isDark ? '#34D399' : '#059669'} strokeWidth={2.4} />
              </View>
              <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Visa{'\n'}Assistance
              </Text>
              <Text style={[styles.featureSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Hassle-free visa and travel help.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outerCardWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 32,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 7,
    backgroundColor: 'transparent',
  },
  innerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
  },
  topContentOverlay: {
    paddingTop: 22,
    paddingHorizontal: 22,
    zIndex: 10,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 33,
    letterSpacing: -0.6,
  },
  countryHighlight: {
    color: '#007A55',
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
    marginTop: 8,
  },
  accentBar: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007A55',
    marginTop: 10,
  },
  bottomCapsuleWrap: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    zIndex: 10,
  },
  capsuleInner: {
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  featureCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 3,
  },
  featureSub: {
    fontSize: 7.5,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 10,
  },
  vDivider: {
    width: 1,
    height: '75%',
    alignSelf: 'center',
  },
});
