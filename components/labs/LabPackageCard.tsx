import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, Home, TestTube, CheckCircle2, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

export interface LabPackageItem {
  id: string;
  name: string;
  tag: string;
  testCount: number;
  tests: string[];
  image: string;
  price: string;
  oldPrice: string;
  available: string;
  type: string;
  homeCollection: boolean;
  tat?: string;
  provider?: string;
}

interface LabPackageCardProps {
  packageItem: LabPackageItem;
  onBook: (pkg: LabPackageItem) => void;
}

export default function LabPackageCard({ packageItem, onBook }: LabPackageCardProps) {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBook(packageItem);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {/* Top Header Row with Provider / Tag */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.tagPill, packageItem.tag.includes('LENSKART') ? styles.lenskartTag : styles.defaultTag]}>
            <Text style={styles.tagText}>{packageItem.tag}</Text>
          </View>
          {packageItem.homeCollection && (
            <View style={[styles.metaPill, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
              <Home size={11} color="#10B981" />
              <Text style={[styles.metaText, { color: isDark ? '#A1A1AA' : '#52525B' }]}>Free Home Pickup</Text>
            </View>
          )}
        </View>

        <View style={styles.tatPill}>
          <Clock size={11} color="#6B7280" />
          <Text style={styles.tatText}>{packageItem.tat ?? '24h Reports'}</Text>
        </View>
      </View>

      {/* Main Content Info */}
      <View style={styles.contentRow}>
        <Image
          source={{ uri: packageItem.image }}
          style={styles.packageImage}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.infoContainer}>
          <Text style={[styles.packageName, { color: colors.text }]} numberOfLines={2}>
            {packageItem.name}
          </Text>
          
          <View style={styles.testCountRow}>
            <TestTube size={13} color="#10B981" />
            <Text style={styles.testCountText}>{packageItem.testCount} Lab Parameters Included</Text>
          </View>

          {/* Test Pills */}
          <View style={styles.testsWrap}>
            {packageItem.tests.slice(0, 3).map((t, idx) => (
              <View key={idx} style={[styles.testChip, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                <CheckCircle2 size={10} color="#10B981" />
                <Text style={[styles.testChipText, { color: isDark ? '#D4D4D8' : '#64748B' }]} numberOfLines={1}>
                  {t}
                </Text>
              </View>
            ))}
            {packageItem.tests.length > 3 && (
              <Text style={styles.moreCount}>+{packageItem.tests.length - 3} more</Text>
            )}
          </View>
        </View>
      </View>

      {/* Footer Pricing & CTA Row */}
      <View style={[styles.footerRow, { borderTopColor: isDark ? '#27272A' : '#F3F4F6' }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: colors.text }]}>{packageItem.price}</Text>
          {packageItem.oldPrice && (
            <Text style={styles.oldPrice}>{packageItem.oldPrice}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.bookBtn} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.bookBtnText}>Book Test</Text>
          <ChevronRight size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  defaultTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  lenskartTag: {
    backgroundColor: 'rgba(255, 84, 54, 0.15)',
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#10B981',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tatText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  packageImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  packageName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
  },
  testCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  testCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  testsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  testChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  testChipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreCount: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  oldPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  bookBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
