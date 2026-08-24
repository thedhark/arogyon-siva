import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useTheme } from '@/hooks/useTheme';
import { TrustedDoctor } from '@/constants/trusted-doctors';
import { Fonts } from '@/constants/theme';
import BookVisitSelector, { SelectedPatientInfo } from '@/components/booking/BookVisitSelector';

interface TopDoctorGridCardProps {
  doctor: TrustedDoctor;
}

export default function TopDoctorGridCard({ doctor }: TopDoctorGridCardProps) {
  const { isDark } = useTheme();
  const router = useRouter();
  const cartItems = useBookingStore(state => state.cartItems);
  const addCartItem = useBookingStore(state => state.addCartItem);
  const removeCartItem = useBookingStore(state => state.removeCartItem);
  const updateCartItemPatient = useBookingStore(state => state.updateCartItemPatient);

  const existingCartItem = cartItems.find(
    item => item.itemId === doctor.id && item.type === 'visit'
  );

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/doctor/${doctor.id}` as any);
  };

  const handleBookPress = (patient?: SelectedPatientInfo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addCartItem({
      type: 'visit',
      itemId: doctor.id,
      title: doctor.name,
      subtitle: `${doctor.specialty} • ${doctor.hospital}`,
      price: doctor.fee,
      originalPrice: Math.round(doctor.fee * 1.43),
      savingsAmount: Math.round(doctor.fee * 0.43),
      image: doctor.image,
      hospitalName: doctor.hospital,
      selectedTime: doctor.nextAvailable || '10:00 AM',
      assignedPatientId: patient?.id || 'me',
      assignedPatientName: patient?.name,
      assignedPatientRelation: patient?.relation,
      assignedPatientAvatar: patient?.avatar,
    });
  };

  const handleCountChange = (count: number, patient?: SelectedPatientInfo) => {
    if (count === 0) {
      if (existingCartItem) {
        removeCartItem(existingCartItem.id);
      }
    } else if (existingCartItem) {
      updateCartItemPatient(existingCartItem.id, {
        assignedPatientId: patient?.id,
        assignedPatientName: patient?.name,
        assignedPatientRelation: patient?.relation,
        assignedPatientAvatar: patient?.avatar,
      });
    } else if (patient) {
      handleBookPress(patient);
    }
  };

  // Only keep the count of patients (remove "Patients" / "Patients treated" word)
  const patientCountDisplay = (doctor.patientsTreated || '')
    .replace(/\s*patients(\s+treated)?/gi, '')
    .trim();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      style={styles.card}
    >
      {/* Doctor Image Container (Isolated Container with Border Radius & Depth) */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: doctor.image }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Doctor Details Body (Clean, Flat, No Container Depth) */}
      <View style={styles.body}>
        {/* Name & Rating Row */}
        <View style={styles.nameRow}>
          <Text style={[styles.doctorName, { color: isDark ? '#F9FAFB' : '#111827' }]} numberOfLines={1}>
            {doctor.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Star size={9.5} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
          </View>
        </View>

        {/* Hospital Name */}
        <Text style={[styles.hospitalText, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={1}>
          {doctor.hospital}
        </Text>

        {/* Patients Treated (Count only, no "Patients" text) */}
        <View style={styles.patientsRow}>
          <Users size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.patientsText, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={1}>
            {patientCountDisplay}
          </Text>
        </View>

        {/* Clear Dashed Line Separator */}
        <View style={[styles.dashedLine, { borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : '#CBD5E1' }]} />

        {/* Price & Add Visit Action Row */}
        <View style={styles.priceActionRow}>
          <Text style={[styles.priceText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            ₹{doctor.fee}
          </Text>
          <View style={styles.bookBtnWrapper}>
            <BookVisitSelector
              compact
              buttonLabel="ADD VISIT"
              initialSelectedIds={
                existingCartItem?.assignedPatientId
                  ? [existingCartItem.assignedPatientId]
                  : existingCartItem
                  ? ['me']
                  : []
              }
              onBookPress={(patient) => handleBookPress(patient)}
              onCountChange={(count, patient) => handleCountChange(count, patient)}
            />
          </View>
        </View>

        {/* Bottom Offer Badge */}
        <View style={[styles.offerPill, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF' }]}>
          <Text style={styles.offerPillText}>30% OFF on Consultation</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.12,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bookBtnWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  body: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  doctorName: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginRight: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    paddingHorizontal: 5.5,
    paddingVertical: 2.5,
    borderRadius: 5,
    gap: 2.5,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  hospitalText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  patientsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    marginBottom: 8,
  },
  patientsText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
  },
  dashedLine: {
    borderTopWidth: 1.2,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  offerPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  offerPillText: {
    color: '#2563EB',
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
});
