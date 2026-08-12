import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, BadgePercent } from 'lucide-react-native';

interface HospitalOffersBannerProps {
  headlineOffer?: string;
  offersCount?: number;
  onPress: () => void;
  isDark?: boolean;
}

export default function HospitalOffersBanner({
  headlineOffer = '30% OFF up to ₹75 above ₹49',
  offersCount = 6,
  onPress,
  isDark = false,
}: HospitalOffersBannerProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E1B2E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftGroup}>
        <View style={styles.badgeWrapper}>
          <BadgePercent size={18} color="#3B82F6" fill="#EFF6FF" />
        </View>
        <Text
          style={[
            styles.headlineText,
            { color: isDark ? '#F3F4F6' : '#1E293B' },
          ]}
          numberOfLines={1}
        >
          {headlineOffer}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        <Text style={[styles.offersCountText, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
          {offersCount} offers
        </Text>
        <ChevronDown size={18} color={isDark ? '#9CA3AF' : '#64748B'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  badgeWrapper: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offersCountText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
});
