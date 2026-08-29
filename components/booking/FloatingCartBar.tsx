import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronRight, X, Percent } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useTabBarStore } from '@/hooks/useTabBarStore';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

interface FloatingCartBarProps {
  variant?: 'home' | 'hospital' | 'detail';
  onPressContinue?: () => void;
  bottomOffset?: number;
  onDismiss?: () => void;
}

export default function FloatingCartBar({
  variant = 'hospital',
  onPressContinue,
  bottomOffset,
  onDismiss,
}: FloatingCartBarProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const cartItems = useBookingStore((state) => state.cartItems);
  const isTabBarVisible = useTabBarStore((state) => state.isTabBarVisible);
  const [isDismissed, setIsDismissed] = useState(false);
  const [prevCount, setPrevCount] = useState(cartItems?.length || 0);

  const bottomPadding = insets.bottom > 0 ? insets.bottom : Platform.OS === 'ios' ? 14 : 8;

  const defaultBaseBottom = variant === 'home' 
    ? (bottomOffset !== undefined && bottomOffset > 0 ? bottomOffset : (Platform.OS === 'ios' ? 108 : 98))
    : (bottomOffset !== undefined ? bottomOffset : 0);
  const hiddenBaseBottom = variant === 'home'
    ? (Platform.OS === 'ios' ? 30 : 18)
    : (bottomOffset !== undefined ? bottomOffset : 0);

  const targetBottom = isTabBarVisible ? defaultBaseBottom : hiddenBaseBottom;
  const animBottom = useSharedValue(targetBottom);

  useEffect(() => {
    animBottom.value = withSpring(targetBottom, {
      damping: 20,
      stiffness: 220,
      mass: 0.6,
    });
  }, [targetBottom]);

  const animatedBottomStyle = useAnimatedStyle(() => ({
    bottom: animBottom.value,
  }));

  // If new items are added to cart, re-show the floating bar
  useEffect(() => {
    if ((cartItems?.length || 0) > prevCount) {
      setIsDismissed(false);
    }
    setPrevCount(cartItems?.length || 0);
  }, [cartItems?.length]);

  if (!cartItems || cartItems.length === 0 || isDismissed) {
    return null;
  }

  const latestItem = cartItems[0];
  const displayTitle = latestItem.hospitalName || latestItem.title || 'Apollo Hospital';
  const itemCount = cartItems.length;
  const countText = `${itemCount} selected`;

  const handleContinue = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {}

    if (onPressContinue) {
      onPressContinue();
    } else {
      router.push('/booking/checkout');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // -------------------------------------------------------------
  // HOME PAGE VARIANT: Compact White Card (Hospital Logo + View Care + My Care Pill + Close)
  // -------------------------------------------------------------
  if (variant === 'home') {
    return (
      <Animated.View style={[styles.homeWrapper, animatedBottomStyle]}>
        <View
          style={[
            styles.homeContainer,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Left Provider Logo / Square Frame */}
          <TouchableOpacity
            style={styles.homeLeftSection}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.homeLogoFrame,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FAFAFA',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Image
                source={{
                  uri:
                    latestItem.image ||
                    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
                }}
                style={styles.homeLogoImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>

          {/* Middle Details Section */}
          <TouchableOpacity
            style={styles.homeMiddleSection}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.homeTitleText,
                { color: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
              numberOfLines={1}
            >
              {displayTitle}
            </Text>
            <View style={styles.homeLinkRow}>
              <Text style={styles.homeLinkText}>View Care</Text>
              <ChevronRight size={14} color="#E11D48" strokeWidth={2.6} />
            </View>
          </TouchableOpacity>

          {/* Right Red Action Button & Dismiss Icon */}
          <View style={styles.homeRightSection}>
            <TouchableOpacity
              style={styles.homeRedPillButton}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.homePillTitleText}>My Care</Text>
              <Text style={styles.homePillSubtitleText}>{countText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeCloseButton}
              onPress={handleDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <X size={20} color={isDark ? '#94A3B8' : '#475569'} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  // -------------------------------------------------------------
  // HOSPITAL / DETAIL PAGE VARIANT: Full Zomato-Style Cart Banner
  // -------------------------------------------------------------
  const previewImages = cartItems
    .slice(0, 3)
    .map(
      (item) =>
        item.image ||
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200'
    );
  const itemsText = `${itemCount} care added`;

  return (
    <Animated.View style={[styles.detailWrapper, animatedBottomStyle]}>
      <View
        style={[
          styles.detailContainerCard,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderColor: isDark ? '#1E293B' : '#E2E8F0',
            paddingBottom: bottomPadding,
          },
        ]}
      >
        {/* Top Perk / Gold Benefit Banner */}
        <View
          style={[
            styles.detailPerkBanner,
            {
              backgroundColor: isDark ? '#172554' : '#F0F7FF',
            },
          ]}
        >
          <View style={styles.detailPerkBadge}>
            <Percent size={14} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text
            style={[
              styles.detailPerkText,
              { color: isDark ? '#93C5FD' : '#1D4ED8' },
            ]}
            numberOfLines={1}
          >
            You've unlocked Free consultation perks with Care
          </Text>
          <TouchableOpacity
            style={styles.detailCloseBtn}
            onPress={handleDismiss}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={15} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {/* Main Crimson-Red Action Bar */}
        <TouchableOpacity
          style={styles.detailMainActionBar}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          {/* Left Side: Overlapping circular images + Items added text */}
          <View style={styles.detailLeftContent}>
            <View style={styles.detailAvatarStack}>
              {previewImages.map((imgUri, idx) => (
                <Image
                  key={idx}
                  source={{ uri: imgUri }}
                  style={[
                    styles.detailItemAvatar,
                    idx > 0 && styles.detailItemAvatarOverlap,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.detailItemsAddedText}>{itemsText}</Text>
          </View>

          {/* Right Side: Continue > */}
          <View style={styles.detailRightContent}>
            <Text style={styles.detailContinueText}>Continue</Text>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.6} />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // HOME PAGE VARIANT STYLES
  homeWrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  homeContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 26,
    borderWidth: 1,
  },
  homeLeftSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeLogoFrame: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  homeLogoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  homeMiddleSection: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  homeTitleText: {
    fontFamily: Fonts.bold,
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  homeLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 1,
  },
  homeLinkText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#E11D48', // Crimson Red
  },
  homeRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeRedPillButton: {
    backgroundColor: '#E11D48',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 95,
  },
  homePillTitleText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  homePillSubtitleText: {
    fontFamily: Fonts.medium,
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  homeCloseButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // HOSPITAL / DETAIL PAGE VARIANT STYLES
  detailWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 12,
  },
  detailContainerCard: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    borderTopWidth: 1,
  },
  detailPerkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 8,
  },
  detailPerkBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailPerkText: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  detailCloseBtn: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailMainActionBar: {
    backgroundColor: '#E11D48', // Vibrant Crimson Red
    marginHorizontal: 14,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  detailItemAvatarOverlap: {
    marginLeft: -10,
  },
  detailItemsAddedText: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  detailRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailContinueText: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
