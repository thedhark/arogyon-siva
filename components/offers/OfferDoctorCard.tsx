import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Star, Building2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { OfferDoctor } from '@/constants/offers-data';
import { useBookingStore } from '@/hooks/useBookingStore';

interface OfferDoctorCardProps {
  doctor: OfferDoctor;
}

export default function OfferDoctorCard({ doctor }: OfferDoctorCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const addCartItem = useBookingStore((s) => s.addCartItem);

  const handleBook = () => {
    // Add visit item to cart with discount
    addCartItem({
      type: 'visit',
      itemId: doctor.id,
      title: doctor.name,
      subtitle: `${doctor.specialty} • ${doctor.hospital}`,
      price: doctor.discountedPrice,
      originalPrice: doctor.originalPrice,
      savingsAmount: doctor.originalPrice - doctor.discountedPrice,
      image: doctor.image,
      hospitalName: doctor.hospital,
      selectedTime: doctor.nextAvailable,
    });

    // Navigate to checkout
    router.push('/booking/checkout' as any);
  };

  const handleViewDoctor = () => {
    router.push(`/doctor/${doctor.id}` as any);
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
      {/* Top Banner Row: 50% OFF Badge & Clinic Tag */}
      <View style={styles.topBadgeRow}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>FLAT 50% OFF</Text>
        </View>

        <View style={styles.clinicBadge}>
          <Building2 size={11} color="#6366F1" />
          <Text style={styles.clinicBadgeText}>In-Clinic / OPD</Text>
        </View>
      </View>

      {/* Main Doctor Info Section */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleViewDoctor}
        style={styles.mainInfoRow}
      >
        {/* Doctor Photo */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: doctor.image }}
            style={styles.doctorImage}
            contentFit="cover"
          />
          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={12} color="#FFFFFF" fill="#3B82F6" />
          </View>
        </View>

        {/* Doctor Details */}
        <View style={styles.detailsContent}>
          <Text
            style={[
              styles.doctorName,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
            numberOfLines={1}
          >
            {doctor.name}
          </Text>

          <Text
            style={[
              styles.specialtyText,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
            numberOfLines={1}
          >
            {doctor.specialty}
          </Text>

          <Text
            style={[
              styles.metaText,
              { color: isDark ? '#64748B' : '#94A3B8' },
            ]}
            numberOfLines={1}
          >
            {doctor.experience} • {doctor.hospital}
          </Text>

          {/* Rating & Slot */}
          <View style={styles.ratingSlotRow}>
            <View style={styles.ratingPill}>
              <Star size={11} color="#EAB308" fill="#EAB308" />
              <Text style={styles.ratingScore}>{doctor.rating}</Text>
              <Text style={styles.reviewCount}>({doctor.reviewsCount})</Text>
            </View>

            <Text
              style={[
                styles.slotText,
                { color: isDark ? '#38BDF8' : '#0284C7' },
              ]}
              numberOfLines={1}
            >
              {doctor.nextAvailable}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? '#273043' : '#F1F5F9' },
        ]}
      />

      {/* Bottom Pricing & CTA Row */}
      <View style={styles.bottomRow}>
        {/* Slashed Original Price + Bold Discounted Price */}
        <View style={styles.priceContainer}>
          <View style={styles.priceLabelRow}>
            <Text style={styles.slashedPrice}>₹{doctor.originalPrice}</Text>
            <Text style={styles.saveTag}>SAVE 50%</Text>
          </View>
          <View style={styles.activePriceRow}>
            <Text
              style={[
                styles.discountedPrice,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              ₹{doctor.discountedPrice}
            </Text>
            <Text
              style={[
                styles.perConsultText,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              / consult
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBook}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Book Slot</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clinicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  clinicBadgeText: {
    color: '#4F46E5',
    fontSize: 10.5,
    fontWeight: '700',
  },
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageWrapper: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: 'relative',
    overflow: 'visible',
  },
  doctorImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 1,
  },
  detailsContent: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  specialtyText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  ratingSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
  reviewCount: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  slotText: {
    fontSize: 11,
    fontWeight: '700',
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
  perConsultText: {
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
