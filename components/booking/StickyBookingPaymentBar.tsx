import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, ScrollView, Dimensions } from 'react-native';
import { ArrowDownCircle, Heart, ShoppingBag, Calendar, ShieldCheck, Check, Tag, Sparkles, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

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
  ctaText = 'Book Package',
  tokenCtaText,
  ctaIcon = 'calendar',
  showBookmark = false,
  isBookmarked = false,
  onToggleBookmark,
  onPressCTA,
  onPressTokenCTA,
  disabled = false,
}: StickyBookingPaymentBarProps) {
  const { colors, isDark } = useTheme();
  
  const [offerIndex, setOfferIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
        return <Calendar size={17} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'shield':
        return <ShieldCheck size={17} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'check':
        return <Check size={17} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'bag':
      default:
        return <ShoppingBag size={17} color="#FFFFFF" style={styles.ctaIcon} />;
    }
  };

  const IconComp = currentOffer.icon;

  return (
    <View style={styles.fixedWrapper}>
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

      {/* Sticky Rounded Card Action Bar */}
      <View
        style={[
          styles.cardBar,
          {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            borderWidth: isDark ? 0.5 : 0,
          },
          tokenCtaText ? { paddingHorizontal: 12, paddingVertical: 10, gap: 10 } : {},
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
                colors={isDark ? ['#36224B', '#221533', '#130B1E'] : ['#F5EEFF', '#EBE0FA', '#DDD0F7']}
                locations={[0, 0.5, 1]}
                style={styles.tokenBtnGradient}
              >
                <Calendar size={15} color={isDark ? '#DDD6FE' : '#6527BE'} />
                <Text style={[styles.tokenBtnText, { color: isDark ? '#DDD6FE' : '#5B21B6' }]} numberOfLines={1}>
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

          {/* Primary Full Package CTA Button - Tactile Dark Obsidian Beveled Pill */}
          <TouchableOpacity
            style={[
              styles.ctaBtnWrapper,
              tokenCtaText ? { flex: 1, minWidth: 0 } : {},
              disabled && { opacity: 0.6 },
            ]}
            onPress={onPressCTA}
            disabled={disabled}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#2A2C33', '#16171B', '#0B0C0E']}
              locations={[0, 0.5, 1]}
              style={styles.ctaBtnGradient}
            >
              {renderCtaIcon()}
              <Text style={styles.ctaText} numberOfLines={1}>{ctaText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 16 : 8,
    left: 8,
    right: 8,
    alignItems: 'center',
    zIndex: 999,
  },
  priceDropPill: {
    width: '94%',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: -6,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
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
    shadowColor: '#6527BE',
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
    borderColor: 'rgba(101, 39, 190, 0.25)',
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
