import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin, Calendar, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react-native';
import { resolveImageSource } from '@/utils/imageUtils';

interface Props {
  image: string;
  name: string;
  speciality: string;
  rating: string;
  reviews: string;
  location?: string;
  distance?: string;
  nextAvailable?: string;
  verified?: boolean;
  price: string;
  onPress: () => void;
  colors: any;
  isDark: boolean;
}

export default function DoctorListItem({
  image,
  name,
  speciality,
  rating,
  reviews,
  location,
  distance,
  nextAvailable = 'Today, 4:00 PM',
  verified = true,
  price,
  onPress,
  colors,
  isDark,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
          shadowColor: isDark ? '#000000' : '#1E293B',
        },
      ]}
      onPress={onPress}
    >
      {/* Top Main Section */}
      <View style={styles.headerSection}>
        {/* Doctor Avatar with status badge */}
        <View style={styles.avatarWrapper}>
          <Image
            source={resolveImageSource(image, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200')}
            style={styles.avatar}
          />
          <View style={[styles.statusDot, { borderColor: isDark ? '#1C1C1E' : '#FFFFFF' }]} />
        </View>

        {/* Doctor Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.nameRow}>
            <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
              {name}
            </Text>
            {verified && (
              <CheckCircle2 size={16} color="#10B981" fill="#D1FAE5" style={styles.verifiedBadge} />
            )}
          </View>

          {/* Specialty tag */}
          <View style={styles.specialityRow}>
            <Stethoscope size={13} color="#6366F1" />
            <Text style={[styles.specialityText, { color: isDark ? '#9CA3AF' : '#4B5563' }]} numberOfLines={1}>
              {speciality}
            </Text>
          </View>

          {/* Rating & Location row */}
          <View style={styles.metaRow}>
            <View style={[styles.ratingBadge, { backgroundColor: isDark ? '#2D220B' : '#FEF3C7' }]}>
              <Star size={11} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingNumber}>{rating}</Text>
              <Text style={styles.reviewsCount}>({reviews})</Text>
            </View>

            {location && (
              <View style={styles.locationContainer}>
                <MapPin size={12} color="#9CA3AF" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location} {distance ? `• ${distance}` : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Mid Slot Strip */}
      <View style={[styles.slotStrip, { backgroundColor: isDark ? '#141416' : '#F8FAFC' }]}>
        <View style={styles.slotLeft}>
          <Calendar size={13} color="#6366F1" />
          <Text style={[styles.slotLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Next Slot:
          </Text>
          <Text style={[styles.slotValue, { color: colors.text }]}>
            {nextAvailable}
          </Text>
        </View>
        <View style={styles.availabilityPill}>
          <Text style={styles.availabilityText}>Available</Text>
        </View>
      </View>

      {/* Bottom Action Footer */}
      <View style={[styles.footerSection, { borderTopColor: isDark ? '#2C2C2E' : '#F1F5F9' }]}>
        <View style={styles.feeBlock}>
          <Text style={styles.feeLabel}>CONSULTATION</Text>
          <Text style={[styles.feeValue, { color: colors.text }]}>{price}</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
          <ChevronRight size={14} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  headerSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  verifiedBadge: {
    marginLeft: 6,
  },
  specialityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  specialityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  reviewsCount: {
    fontSize: 11,
    fontWeight: '500',
    color: '#92400E',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  slotStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  slotValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  availabilityPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  feeBlock: {
    justifyContent: 'center',
  },
  feeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 1,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
