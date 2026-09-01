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
  discount,
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
  const discountPercent = discount || (savings > 0 ? `${Math.round((savings / numericOriginal) * 100)}% OFF` : '');

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
        {/* Top: Price Row with savings tag */}
        <View style={styles.priceHeaderRow}>
          <View style={styles.priceCol}>
            <View style={styles.priceLabelRow}>
              <Tag size={13} color={isDark ? '#34D399' : '#0D9488'} />
              <Text style={[styles.priceLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                PACKAGE PRICE
              </Text>
            </View>
            <View style={styles.priceValuesRow}>
              <Text style={[styles.priceValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {price}
              </Text>
              {displayOriginalPrice ? (
                <Text style={styles.originalPrice}>{displayOriginalPrice}</Text>
              ) : null}
            </View>
          </View>

          {savings > 0 ? (
            <View
              style={[
                styles.savingsBadge,
                {
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                  borderColor: isDark ? 'rgba(52, 211, 153, 0.25)' : '#A7F3D0',
                },
              ]}
            >
              <Text style={[styles.savingsText, { color: isDark ? '#34D399' : '#059669' }]}>
                Save ₹{savings.toLocaleString('en-IN')}
              </Text>
              {discountPercent ? (
                <Text style={[styles.discountText, { color: isDark ? '#6EE7B7' : '#047857' }]}>
                  {discountPercent}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

        {/* Bottom Details Row: Validity & Duration */}
        <View style={styles.detailsRow}>
          {/* Validity */}
          <View style={styles.detailItem}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F7F0' }]}>
              <Calendar size={16} color={isDark ? '#34D399' : '#0D9488'} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Validity</Text>
              <Text style={[styles.detailValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{validity}</Text>
              {validitySubtext ? (
                <Text style={[styles.detailSubtext, { color: isDark ? '#64748B' : '#94A3B8' }]}>{validitySubtext}</Text>
              ) : null}
            </View>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

          {/* Duration */}
          <View style={styles.detailItem}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F7F0' }]}>
              <Clock size={16} color={isDark ? '#34D399' : '#0D9488'} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Duration</Text>
              <Text style={[styles.detailValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{duration}</Text>
              {durationSubtext ? (
                <Text style={[styles.detailSubtext, { color: isDark ? '#64748B' : '#94A3B8' }]}>{durationSubtext}</Text>
              ) : null}
            </View>
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
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCol: {
    flex: 1,
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  priceLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  priceValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  savingsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-end',
  },
  savingsText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  detailSubtext: {
    fontSize: 10,
    marginTop: 1,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 12,
  },
});
