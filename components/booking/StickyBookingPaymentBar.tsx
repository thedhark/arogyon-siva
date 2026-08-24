import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, ScrollView, Dimensions } from 'react-native';
import { ArrowDownCircle, Heart, ShoppingBag, Calendar, ShieldCheck, Check, Tag, Sparkles, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface StickyBookingPaymentBarProps {
  priceDropText?: string; // Optional custom main offer
  price: number | string;
  originalPrice?: number | string;
  discountText?: string;
  taxSubtext?: string;
  ctaText?: string;
  tokenCtaText?: string;
  ctaIcon?: 'bag' | 'calendar' | 'shield' | 'check';
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onPressCTA: () => void;
  onPressTokenCTA?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'hospital';
  visible?: boolean;
  animatedTranslateY?: Animated.Value;
}

const OFFERS = [
  { id: '1', text: 'Price dropped by ₹167', icon: ArrowDownCircle, iconColor: '#10B981', bg: '#E8F5E9', textColor: '#1B5E20' },
  { id: '2', text: 'Flat ₹200 OFF code "AROGYON200"', icon: Tag, iconColor: '#3B82F6', bg: '#EFF6FF', textColor: '#1E40AF' },
  { id: '3', text: '10% Instant Cashback via UPI', icon: Zap, iconColor: '#F59E0B', bg: '#FEF3C7', textColor: '#92400E' },
  { id: '4', text: 'Free Follow-up Consultation', icon: Sparkles, iconColor: '#A855F7', bg: '#F3E8FF', textColor: '#6B21A8' },
];

export default function StickyBookingPaymentBar({
  priceDropText,
  price,
  originalPrice,
  discountText,
  taxSubtext,
  ctaText = 'ADD Package',
  tokenCtaText,
  ctaIcon = 'calendar',
  showBookmark = false,
  isBookmarked = false,
  onToggleBookmark,
  onPressCTA,
  onPressTokenCTA,
  disabled = false,
  variant = 'default',
  visible = true,
  animatedTranslateY,
}: StickyBookingPaymentBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);
  
  const isHospitalVariant = variant === 'hospital';
  const ctaGradientColors = isHospitalVariant 
    ? ['#9BF229', '#14CE65'] 
    : ['#2A2C33', '#16171B', '#0B0C0E'];
  const ctaTextColor = isHospitalVariant ? '#052E16' : '#FFFFFF';
  const ctaIconColor = isHospitalVariant ? '#052E16' : '#FFFFFF';
  
  const [offerIndex, setOfferIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 160)).current;

  // Responsive slide on scroll visibility change
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 160,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  // Auto-swipe / cycle offers every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      // Smooth fade transition
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();

      setOfferIndex((prev) => (prev + 1) % OFFERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [fadeAnim]);

  const handleNextOffer = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
    setOfferIndex((prev) => (prev + 1) % OFFERS.length);
  };

  const currentOffer = OFFERS[offerIndex];
  const offerTextToShow = offerIndex === 0 && priceDropText ? priceDropText : currentOffer.text;

  const formattedPrice = typeof price === 'number' ? `₹${price}` : price.startsWith('₹') ? price : `₹${price}`;
  const formattedOriginalPrice = originalPrice 
    ? (typeof originalPrice === 'number' ? `₹${originalPrice}` : originalPrice.startsWith('₹') ? originalPrice : `₹${originalPrice}`)
    : null;

  const renderCtaIcon = () => {
    switch (ctaIcon) {
      case 'calendar':
        return <Calendar size={17} color={ctaIconColor} style={styles.ctaIcon} />;
      case 'shield':
        return <ShieldCheck size={17} color={ctaIconColor} style={styles.ctaIcon} />;
      case 'check':
        return <Check size={17} color={ctaIconColor} style={styles.ctaIcon} />;
      case 'bag':
      default:
        return <ShoppingBag size={17} color={ctaIconColor} style={styles.ctaIcon} />;
    }
  };

  const IconComp = currentOffer.icon;

  return (
    <Animated.View 
      style={[
        styles.fixedWrapper,
        {
          transform: [{ translateY: animatedTranslateY ?? slideAnim }],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Auto-Swiping & Manual Swipeable Coupon / Offer Banner */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleNextOffer}
        style={[styles.priceDropPill, { backgroundColor: isDark ? '#1F2937' : currentOffer.bg }]}
      >
        <Animated.View style={[styles.offerContent, { opacity: fadeAnim }]}>
          <IconComp size={15} color={currentOffer.iconColor} />
          <Text style={[styles.priceDropText, { color: isDark ? '#F3F4F6' : currentOffer.textColor }]}>
            {offerTextToShow}
          </Text>
          
          {/* Pagination Indicators */}
          <View style={styles.dotRow}>
            {OFFERS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  {
                    backgroundColor: idx === offerIndex 
                      ? (isDark ? '#60A5FA' : currentOffer.iconColor) 
                      : 'rgba(0,0,0,0.15)',
                    width: idx === offerIndex ? 10 : 4,
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Sticky Edge-to-Edge Action Bar */}
      <View
        style={[
          styles.cardBar,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            paddingBottom: bottomInset + 4,
          },
          tokenCtaText ? { paddingHorizontal: 16, paddingTop: 12, gap: 10 } : {},
        ]}
      >
        {/* Left Price Details (Only shown in single-button mode to prevent 3-element horizontal overflow) */}
        {!tokenCtaText && (
          <View style={styles.priceColumn}>
            <Text style={[styles.mainPrice, { color: colors.text }]}>{formattedPrice}</Text>
            
            <View style={styles.subPriceRow}>
              {formattedOriginalPrice && (
                <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
              )}
              {discountText && (
                <Text style={styles.discountText}>{discountText}</Text>
              )}
            </View>
            {taxSubtext ? <Text style={styles.taxText}>{taxSubtext}</Text> : null}
          </View>
        )}

        {/* Action Buttons Container */}
        <View style={[styles.rightActions, tokenCtaText ? { flex: 1, gap: 8 } : {}]}>
          {/* Dual Button Mode 1: Token Reserve Button (₹499) - Tactile Purple Obsidian Pill */}
          {tokenCtaText && (
            <TouchableOpacity
              style={[
                styles.tokenBtnWrapper,
                { flex: 1 },
                disabled && { opacity: 0.6 },
              ]}
              onPress={onPressTokenCTA}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isDark ? ['#1E293B', '#1E3A8A', '#1D4ED8'] : ['#EFF6FF', '#DBEAFE', '#BFDBFE']}
                locations={[0, 0.5, 1]}
                style={styles.tokenBtnGradient}
              >
                <Calendar size={15} color={isDark ? '#93C5FD' : '#1D4ED8'} />
                <Text style={[styles.tokenBtnText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]} numberOfLines={1}>
                  {tokenCtaText}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Optional Bookmark Circle Button */}
          {showBookmark && (
            <TouchableOpacity
              style={[
                styles.wishlistBtn,
                { backgroundColor: isBookmarked ? '#E0F2FE' : '#F0FDF4' },
              ]}
              onPress={onToggleBookmark}
              activeOpacity={0.75}
            >
              <Heart
                size={20}
                color={isBookmarked ? '#0284C7' : '#10B981'}
                fill={isBookmarked ? '#0284C7' : 'transparent'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          )}

          {/* Primary Full Package CTA Button - Reshaped Tactile Gradient Pill */}
          <TouchableOpacity
            style={[
              styles.ctaBtnWrapper,
              tokenCtaText ? { flex: 1, minWidth: 0 } : {},
              disabled && { opacity: 0.6 },
              isHospitalVariant && { shadowColor: '#14CE65', shadowOpacity: 0.4 },
            ]}
            onPress={onPressCTA}
            disabled={disabled}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={ctaGradientColors as [string, string, ...string[]]}
              locations={[0, 0.5, 1]}
              style={styles.ctaBtnGradient}
            >
              {renderCtaIcon()}
              <Text style={[styles.ctaText, { color: ctaTextColor }]} numberOfLines={1}>{ctaText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fixedWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    alignItems: 'stretch',
    zIndex: 999,
  },
  priceDropPill: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: -1,
    zIndex: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  priceDropText: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  cardBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: 2,
  },
  priceColumn: {
    justifyContent: 'center',
    minWidth: 95,
  },
  mainPrice: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 27,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '800',
  },
  taxText: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  wishlistBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenBtnWrapper: {
    borderRadius: 999,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tokenBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 12.5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  tokenBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ctaBtnWrapper: {
    borderRadius: 999,
    minWidth: 125,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 13.5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  ctaIcon: {
    marginRight: 2,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
