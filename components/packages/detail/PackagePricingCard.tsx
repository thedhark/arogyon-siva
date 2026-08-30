import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, Tag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface PackagePricingCardProps {
  price: string;
  originalPrice?: string;
  discount?: string;
  tokenPrice?: string;
  validity?: string;
  validitySubtext?: string;
  duration?: string;
  durationSubtext?: string;
}

export default function PackagePricingCard({
  price,
  originalPrice,
  validity = '12 Months',
  validitySubtext,
  duration = '1 Year',
  durationSubtext,
}: PackagePricingCardProps) {
  const { isDark } = useTheme();

  // Parse numeric values to calculate savings amount
  const numericPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 1999;
  const numericOriginal = originalPrice
    ? parseInt(originalPrice.replace(/[^0-9]/g, ''), 10)
    : Math.round(numericPrice * 1.4);

  const displayOriginalPrice = originalPrice || `₹${numericOriginal.toLocaleString('en-IN')}`;
  const savings = Math.max(0, numericOriginal - numericPrice);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          },
        ]}
      >
        {/* 1. Validity Item */}
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F7F0' }]}>
            <Calendar size={18} color={isDark ? '#34D399' : '#0D9488'} />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Validity</Text>
            <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{validity}</Text>
            {validitySubtext ? (
              <Text style={[styles.statSubtext, { color: isDark ? '#64748B' : '#94A3B8' }]}>{validitySubtext}</Text>
            ) : null}
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

        {/* 2. Duration Item */}
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F7F0' }]}>
            <Clock size={18} color={isDark ? '#34D399' : '#0D9488'} />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Duration</Text>
            <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{duration}</Text>
            {durationSubtext ? (
              <Text style={[styles.statSubtext, { color: isDark ? '#64748B' : '#94A3B8' }]}>{durationSubtext}</Text>
            ) : null}
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

        {/* 3. Package Price Item */}
        <View style={[styles.statItem, { flex: 1.15 }]}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F7F0' }]}>
            <Tag size={18} color={isDark ? '#34D399' : '#0D9488'} />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Package Price</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{price}</Text>
              {displayOriginalPrice ? (
                <Text style={styles.originalPrice}>{displayOriginalPrice}</Text>
              ) : null}
            </View>
            {savings > 0 ? (
              <Text style={[styles.savingsText, { color: isDark ? '#34D399' : '#059669' }]}>
                You save ₹{savings.toLocaleString('en-IN')}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  statSubtext: {
    fontSize: 10,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  originalPrice: {
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    marginHorizontal: 6,
  },
});
