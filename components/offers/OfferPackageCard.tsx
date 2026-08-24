import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, Star, ShieldCheck, Home, UserCheck, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { OfferHealthPackage } from '@/constants/offers-data';
import { useBookingStore } from '@/hooks/useBookingStore';

interface OfferPackageCardProps {
  packageItem: OfferHealthPackage;
}

export default function OfferPackageCard({ packageItem }: OfferPackageCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const addCartItem = useBookingStore((s) => s.addCartItem);

  const handleBook = () => {
    addCartItem({
      type: 'package',
      itemId: packageItem.id,
      title: packageItem.title,
      subtitle: `${packageItem.category} • ${packageItem.hospitalName}`,
      price: packageItem.discountedPrice,
      originalPrice: packageItem.originalPrice,
      savingsAmount: packageItem.originalPrice - packageItem.discountedPrice,
      image: packageItem.image,
      hospitalName: packageItem.hospitalName,
      selectedTime: 'Standard Schedule',
    });

    router.push('/booking/checkout' as any);
  };

  const handleViewDetail = () => {
    router.push(`/packages/category/${packageItem.categoryId}` as any);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1A1F2C' : '#FFFFFF',
          borderColor: isDark ? '#2B3347' : '#F0F2F7',
          shadowColor: isDark ? '#000000' : '#8A9BA8',
        },
      ]}
    >
      {/* Top Tag Row */}
      <View style={styles.topBadgeRow}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>FLAT 50% OFF</Text>
        </View>

        {packageItem.badge ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{packageItem.badge}</Text>
          </View>
        ) : null}

        {packageItem.hasHomeSample ? (
          <View style={styles.homeBadge}>
            <Home size={11} color="#059669" />
            <Text style={styles.homeBadgeText}>Home Sample Free</Text>
          </View>
        ) : null}
      </View>

      {/* Main Info Row */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleViewDetail}
        style={styles.mainInfoRow}
      >
        <Image
          source={{ uri: packageItem.image }}
          style={styles.packageImage}
          contentFit="cover"
        />

        <View style={styles.detailsContent}>
          <Text
            style={[
              styles.packageTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
            numberOfLines={2}
          >
            {packageItem.title}
          </Text>

          <Text
            style={[
              styles.hospitalText,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
            numberOfLines={1}
          >
            {packageItem.hospitalName} • {packageItem.hospitalLocation}
          </Text>

          {/* Rating & Parameters */}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Star size={11} color="#EAB308" fill="#EAB308" />
              <Text style={styles.ratingScore}>{packageItem.rating}</Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.testsPill}>
              <ShieldCheck size={11} color="#3B82F6" />
              <Text style={styles.testsCountText}>{packageItem.testsCount} Tests / Parameters</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Key Inclusions Preview (Top 3) */}
      <View
        style={[
          styles.inclusionsBox,
          { backgroundColor: isDark ? '#141824' : '#F8FAFC' },
        ]}
      >
        {packageItem.inclusions.slice(0, 3).map((inc, i) => (
          <View key={i} style={styles.inclusionItem}>
            <Check size={12} color="#16A34A" strokeWidth={2.5} />
            <Text
              style={[
                styles.inclusionText,
                { color: isDark ? '#CBD5E1' : '#334155' },
              ]}
              numberOfLines={1}
            >
              {inc}
            </Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? '#273043' : '#F1F5F9' },
        ]}
      />

      {/* Bottom Pricing & Action Row */}
      <View style={styles.bottomRow}>
        <View style={styles.priceContainer}>
          <View style={styles.priceLabelRow}>
            <Text style={styles.slashedPrice}>₹{packageItem.originalPrice}</Text>
            <Text style={styles.saveTag}>SAVE 50%</Text>
          </View>
          <View style={styles.activePriceRow}>
            <Text
              style={[
                styles.discountedPrice,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              ₹{packageItem.discountedPrice}
            </Text>
            <Text
              style={[
                styles.perPackageText,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              total package
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBook}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Book Package</Text>
          <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  discountBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  categoryBadgeText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  homeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginLeft: 'auto',
  },
  homeBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  mainInfoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  packageImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
  },
  detailsContent: {
    flex: 1,
    gap: 3,
  },
  packageTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  hospitalText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#854D0E',
  },
  dotSeparator: {
    color: '#94A3B8',
    fontSize: 10,
  },
  testsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  inclusionsBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    gap: 6,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inclusionText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    gap: 1,
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slashedPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  saveTag: {
    fontSize: 9.5,
    color: '#16A34A',
    fontWeight: '800',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  discountedPrice: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  perPackageText: {
    fontSize: 11,
    fontWeight: '500',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E12B38',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    shadowColor: '#E12B38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
