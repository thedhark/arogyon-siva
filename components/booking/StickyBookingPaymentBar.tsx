import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, ScrollView, Dimensions } from 'react-native';
import { ArrowDownCircle, Heart, ShoppingBag, Calendar, ShieldCheck, Check, Tag, Sparkles, Zap } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface StickyBookingPaymentBarProps {
  priceDropText?: string; // Optional custom main offer
  price: number | string;
  originalPrice?: number | string;
  discountText?: string;
  taxSubtext?: string;
  ctaText?: string;
  ctaIcon?: 'bag' | 'calendar' | 'shield' | 'check';
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onPressCTA: () => void;
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
  ctaText = 'Book Visit',
  ctaIcon = 'calendar',
  showBookmark = false,
  isBookmarked = false,
  onToggleBookmark,
  onPressCTA,
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
        return <Calendar size={18} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'shield':
        return <ShieldCheck size={18} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'check':
        return <Check size={18} color="#FFFFFF" style={styles.ctaIcon} />;
      case 'bag':
      default:
        return <ShoppingBag size={18} color="#FFFFFF" style={styles.ctaIcon} />;
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
            borderColor: isDark ? '#333333' : '#F0F0F0',
          },
        ]}
      >
        {/* Left Price Details */}
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

        {/* Right Actions */}
        <View style={styles.rightActions}>
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

          {/* Dark Navy CTA Button */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: isDark ? '#062E35' : '#042D33' },
              disabled && { opacity: 0.6 },
            ]}
            onPress={onPressCTA}
            disabled={disabled}
            activeOpacity={0.85}
          >
            {renderCtaIcon()}
            <Text style={styles.ctaText}>{ctaText}</Text>
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
    paddingVertical: 7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginBottom: -5,
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
    fontSize: 13,
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
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 2,
  },
  priceColumn: {
    justifyContent: 'center',
    minWidth: 100,
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  originalPrice: {
    fontSize: 12.5,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountText: {
    fontSize: 12.5,
    color: '#10B981',
    fontWeight: '800',
  },
  taxText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1.5,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  wishlistBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 150,
    shadowColor: '#042D33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaIcon: {
    marginRight: 2,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
