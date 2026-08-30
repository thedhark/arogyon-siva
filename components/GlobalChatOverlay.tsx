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
import ExpertBentoGrid from './expert/ExpertBentoGrid';

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

  const pageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(chatModeProgress.value, [0, 1], [SCREEN_HEIGHT, 0], Extrapolation.CLAMP);
    const opacity = interpolate(chatModeProgress.value, [0, 0.15, 1], [0, 0.6, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.overlayWrapper]}
      pointerEvents={isPointerActive ? 'auto' : 'none'}
    >
      {/* Dimmed Backdrop */}
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>

      {/* Full Screen Ultra-Minimal Care Page */}
      <Animated.View
        style={[
          styles.fullScreenPage,
          isDark ? styles.pageDark : styles.pageLight,
          pageStyle,
        ]}
      >
        {supportsLiquid ? (
          <GlassView
            glassEffectStyle="regular"
            style={StyleSheet.absoluteFill}
          />
        ) : Platform.OS === 'ios' ? (
          <BlurView
            intensity={95}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        <View style={styles.flexContainer}>
          {/* Main Content Area */}
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(insets.top + 8, 20),
                paddingBottom: Math.max(insets.bottom + 20, 40),
              },
            ]}
            showsVerticalScrollIndicator={false}
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

            {/* ── Care & Specialities Bento Grid ── */}
            <View style={styles.careSection}>
              <ExpertBentoGrid
                isDark={isDark}
                title="Care & Specialities"
                onNavigate={onClose}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 18,
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

  /* ── Care Section ──────────────────────── */
  careSection: {
    marginTop: 8,
    width: '100%',
  },
});
