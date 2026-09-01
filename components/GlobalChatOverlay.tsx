import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Heart, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import WorldClassTreatmentCard from '@/components/care/WorldClassTreatmentCard';
import SeniorSecondOpinionCard from '@/components/care/SeniorSecondOpinionCard';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

interface GlobalChatOverlayProps {
  chatModeProgress: SharedValue<number>;
  onClose: () => void;
}

export default function GlobalChatOverlay({ chatModeProgress, onClose }: GlobalChatOverlayProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const supportsLiquid = isLiquidGlassAvailable();

  const [isNameLiked, setIsNameLiked] = useState(false);
  const [isPointerActive, setIsPointerActive] = useState(false);

  useAnimatedReaction(
    () => chatModeProgress.value > 0.05,
    (active, prev) => {
      if (active !== prev) {
        runOnJS(setIsPointerActive)(active);
      }
    },
    [chatModeProgress]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(chatModeProgress.value, [0, 1], [0, 0.65], Extrapolation.CLAMP),
  }));

  const sheetStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      chatModeProgress.value,
      [0, 1],
      [SCREEN_HEIGHT, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <Animated.View
      pointerEvents={isPointerActive ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFillObject, styles.overlayWrapper]}
    >
      {/* Dim Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Full Screen Slide-in Page */}
      <Animated.View style={[styles.fullScreenPage, sheetStyle]}>
        <View style={[styles.flexContainer, isDark ? styles.pageDark : styles.pageLight]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + (Platform.OS === 'ios' ? 12 : 16),
                paddingBottom: insets.bottom + 24,
              },
            ]}
            bounces={true}
            style={styles.scrollArea}
          >
            {/* Top Header: Left Home Navigation Icon & Right Profile Avatar */}
            <View style={styles.topHeaderRow}>
              {/* Left Side: Home Icon Button for Navigation */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onClose();
                  router.push('/(tabs)');
                }}
                style={[
                  styles.glassHomePill,
                  {
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.6)',
                  },
                ]}
              >
                {Platform.OS === 'ios' && (
                  <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                )}
                <View style={styles.glassHomeContent}>
                  <Home size={18} color="#10B981" strokeWidth={2.5} />
                  <Text style={[styles.homeBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Home</Text>
                </View>
              </TouchableOpacity>

              {/* Right Side: Global Profile Avatar */}
              <TouchableOpacity
                style={styles.avatarContainer}
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                  router.push('/profile');
                }}
              >
                <View style={[styles.avatarBackdrop, { backgroundColor: isDark ? '#333' : '#E2E8F0' }]} />
                <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
              </TouchableOpacity>
            </View>

            {/* ── Greeting Header ──────────────────────── */}
            <View style={styles.greetingHeader}>
              <Text style={[styles.greetingSubtext, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                {getGreeting()}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsNameLiked(!isNameLiked);
                }}
                style={styles.nameRow}
              >
                <Text style={styles.greetingName}>Rahul</Text>
                <Heart
                  size={24}
                  color="#10B981"
                  fill={isNameLiked ? '#10B981' : 'none'}
                  strokeWidth={2.2}
                  style={styles.heartIcon}
                />
              </TouchableOpacity>
            </View>

            {/* ── 3:4 Aspect Ratio Care Cards ──────────────────── */}
            <View style={styles.careCardsList}>
              {/* Card 1: World-Class Treatment India (International Patient Care) */}
              <WorldClassTreatmentCard
                onPress={() => {
                  onClose();
                  router.push('/care/international' as any);
                }}
              />

              {/* Card 2: Senior Specialist 2nd Opinion */}
              <SeniorSecondOpinionCard
                onPress={() => {
                  onClose();
                  router.push('/care/opinion' as any);
                }}
              />
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  fullScreenPage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pageDark: {
    backgroundColor: '#0b0f12',
  },
  pageLight: {
    backgroundColor: '#f6f9f7',
  },
  flexContainer: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },

  /* ── Top Header Row (Home Navigation & Profile Avatar) ─────── */
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  glassHomePill: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  glassHomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatarBackdrop: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    transform: [{ rotate: '12deg' }],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDFDFD',
  },

  /* ── Greeting Header ──────────────────────── */
  greetingHeader: {
    gap: 2,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  greetingSubtext: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: -0.5,
  },
  heartIcon: {
    marginTop: 4,
  },

  /* ── 3:4 Care Cards ──────────────────────── */
  careCardsList: {
    gap: 16,
    marginTop: 12,
    paddingBottom: 24,
  },
  card34Wrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: 'transparent',
  },
  card34Inner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  card34Image: {
    width: '100%',
    height: '100%',
  },
});
