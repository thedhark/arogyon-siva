import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface PackagePricingCardProps {
  price: string;
  originalPrice?: string;
  discount?: string;
  tokenPrice?: string;
}

export default function PackagePricingCard({
  price,
  originalPrice,
  discount = '25% OFF',
}: PackagePricingCardProps) {
  const { isDark } = useTheme();

  // Parse numeric values to calculate savings amount
  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 14999;
  const numericOriginal = originalPrice
    ? parseInt(originalPrice.replace(/[^0-9]/g, ''))
    : Math.round(numericPrice * 1.33);

  const displayOriginalPrice = originalPrice || `₹${numericOriginal.toLocaleString()}`;
  const savings = Math.max(0, numericOriginal - numericPrice);

  return (
    <View style={styles.container}>
      {/* Floating White Card matching New Reference Screenshot */}
      <View
        style={[
          styles.pricingCard,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.cardContentRow}>
          {/* Left Pricing Info */}
          <View style={styles.leftPricingInfo}>
            <View style={styles.priceRow}>
              <Text style={[styles.currentPrice, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {price}
              </Text>
              <Text style={styles.originalPrice}>{displayOriginalPrice}</Text>
            </View>

            {savings > 0 && (
              <Text style={[styles.savingsText, { color: isDark ? '#34D399' : '#059669' }]}>
                You save ₹{savings.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Right Discount Tag Box */}
          {discount ? (
            <View style={[styles.discountTagBox, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
              <Tag size={16} color={isDark ? '#F8FAFC' : '#1E293B'} />
              <Text style={[styles.discountTagText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {discount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  pricingCard: {
    marginTop: -26,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: 10,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftPricingInfo: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
  },
  discountTagBox: {
    width: 68,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    marginLeft: 10,
  },
  discountTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    marginTop: 2,
  },
});
