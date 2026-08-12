import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, HeartPulse, Activity, Stethoscope } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SummerCareBannerProps {
  isDark?: boolean;
  onBackPress?: () => void;
}

export default function SummerCareBanner({ isDark = false, onBackPress }: SummerCareBannerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const handleBannerPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/care/service/preventive');
  };

  const topPadding = Math.max(insets.top + 8, 24);

  return (
    <TouchableOpacity
      activeOpacity={0.94}
      onPress={handleBannerPress}
      style={[
        styles.container,
        {
          paddingTop: topPadding,
          backgroundColor: isDark ? '#1E293B' : '#206BC4',
        },
      ]}
    >
      {/* Soft overlay graphic */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1551076805-e1869043e560?q=80&w=1000' }}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.12 }]}
        contentFit="cover"
      />

      {/* Top Left Navigation Optional Button */}
      {onBackPress && (
        <View style={[styles.topHeaderRow, { top: topPadding - 12 }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBack}
            style={styles.backButton}
          >
            <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}

      {/* Hero Banner Content Stack */}
      <View style={styles.centerContent}>
        <Text style={styles.italicSubtitle}>Your health journey</Text>
        <Text style={styles.mainTitle}>EXPERT CARE</Text>
      </View>

      {/* Bottom Medical Icon Watermarks */}
      <View style={styles.iconRow}>
        <HeartPulse size={36} color="rgba(255, 255, 255, 0.25)" strokeWidth={1.8} />
        <Activity size={36} color="rgba(255, 255, 255, 0.25)" strokeWidth={1.8} />
        <Stethoscope size={36} color="rgba(255, 255, 255, 0.25)" strokeWidth={1.8} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#206BC4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  topHeaderRow: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  italicSubtitle: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#5EEAD4',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    marginTop: 8,
  },
});
