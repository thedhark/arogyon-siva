import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Star, Building2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface DoctorBookingHeaderCardProps {
  doctor: any;
  hospitalName?: string;
  isDark?: boolean;
}

export default function DoctorBookingHeaderCard({
  doctor,
  hospitalName: hospitalNameProp = 'Apollo Hospital',
  isDark: isDarkProp,
}: DoctorBookingHeaderCardProps) {
  const { isDark: themeDark } = useTheme();
  const isDark = isDarkProp ?? themeDark;

  if (!doctor) return null;

  const docName = doctor.name || doctor.title || 'Dr. Specialist';
  const docSpeciality = doctor.speciality || doctor.degrees || 'Specialist';
  const docRating = doctor.rating || '4.9';
  const docReviews = doctor.reviews || doctor.ratingsCount || '1200+ reviews';
  const docImage = doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300';
  
  const rawFee = doctor.fee ?? doctor.price ?? 600;
  const numericFee = typeof rawFee === 'number' ? rawFee : parseFloat(String(rawFee).replace(/[^0-9]/g, '')) || 600;
  const hospitalName = doctor.hospitalName || doctor.hospital || hospitalNameProp || 'Apollo Hospital';
  const location = doctor.location || 'Chennai';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#16181D' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
      ]}
    >
      {/* Top Profile Info */}
      <View style={styles.topRow}>
        <Image source={{ uri: docImage }} style={styles.avatar} contentFit="cover" />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: isDark ? '#F8FAFC' : '#0F172A' }]} numberOfLines={1}>
              {docName}
            </Text>
            <CheckCircle2 size={16} color="#3B82F6" fill="#3B82F6" stroke="#FFFFFF" />
          </View>

          <Text style={[styles.speciality, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
            {docSpeciality}
          </Text>

          <View style={styles.ratingRow}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.ratingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {docRating}
            </Text>
            <Text style={[styles.reviewsText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              ({docReviews})
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' }]} />

      {/* Bottom Row: Hospital Location & Fee */}
      <View style={styles.bottomRow}>
        <View style={styles.hospitalInfo}>
          <View style={[styles.hospitalIconCircle, { backgroundColor: isDark ? '#22252C' : '#F8FAFC' }]}>
            <Building2 size={14} color={isDark ? '#94A3B8' : '#64748B'} />
          </View>
          <View style={styles.hospitalTextCol}>
            <Text style={[styles.hospitalName, { color: isDark ? '#F8FAFC' : '#0F172A' }]} numberOfLines={1}>
              {hospitalName}
            </Text>
            <Text style={[styles.locationText, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <View style={styles.feeCol}>
          <Text style={[styles.feeLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Consultation Fee
          </Text>
          <Text style={[styles.feeValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            ₹{numericFee.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  name: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  speciality: {
    fontSize: 12.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  reviewsText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 8,
  },
  hospitalIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalTextCol: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 11,
  },
  feeCol: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
