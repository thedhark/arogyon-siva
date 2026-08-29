import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/hooks/useBookingStore';
import { TrustedDoctor } from '@/constants/trusted-doctors';
import { Fonts } from '@/constants/theme';
import BookVisitSelector, { SelectedPatientInfo } from '@/components/booking/BookVisitSelector';

interface TrustedDoctorCardProps {
  doctor: TrustedDoctor;
}

export default function TrustedDoctorCard({ doctor }: TrustedDoctorCardProps) {
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
      activeOpacity={0.92}
      onPress={handleCardPress}
      style={styles.card}
    >
      {/* Doctor Image */}
      <Image
        source={{ uri: doctor.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(15, 17, 20, 0.4)', 'rgba(15, 17, 20, 0.88)', '#0F1114']}
        locations={[0, 0.4, 0.72, 0.95]}
        style={styles.gradient}
      />

      {/* Top Left Discount Badge */}
      {doctor.discountBadge && (
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>{doctor.discountBadge}</Text>
        </View>
      )}

      {/* Top Right Rating Badge */}
      <View style={styles.topRatingBadge}>
        <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
        <Text style={styles.topRatingText}>{doctor.rating}</Text>
      </View>

      {/* Bottom Content Info */}
      <View style={styles.bottomContent}>
        {/* Name and Fee Row */}
        <View style={styles.primaryRow}>
          <Text style={styles.doctorName} numberOfLines={1}>
            {doctor.name}
          </Text>
          <Text style={styles.feeText}>₹{doctor.fee}</Text>
        </View>

        {/* Hospital and Subtitle Row */}
        <View style={styles.secondaryRow}>
          <Text style={styles.hospitalName} numberOfLines={1}>
            {doctor.hospital}
          </Text>
          <Text style={styles.feeLabel}>Consultation Fee</Text>
        </View>

        {/* Bottom Actions and Stats Row */}
        <View style={styles.statsAndActionRow}>
          {/* Patients Count (Count only, no "Patients" text) */}
          <View style={styles.patientsGroup}>
            <View style={styles.patientIconCircle}>
              <Users size={11} color="#FFFFFF" />
            </View>
            <Text style={styles.patientsText} numberOfLines={1}>
              {patientCountDisplay}
            </Text>
          </View>

          {/* Interactive Book Visit Selector */}
          <View style={styles.selectorWrapper}>
            <BookVisitSelector
              compact
              buttonLabel="VISIT"
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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 274,
    height: 310,
    borderRadius: 20,
    backgroundColor: '#18181B',
    overflow: 'hidden',
    position: 'relative',
    marginRight: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
  },
  topBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(24, 24, 27, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(10px)',
  },
  topBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  topRatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065F46',
    paddingHorizontal: 7.5,
    paddingVertical: 4.5,
    borderRadius: 7,
    gap: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  topRatingText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  doctorName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginRight: 8,
  },
  feeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  hospitalName: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    marginRight: 8,
  },
  feeLabel: {
    color: '#9CA3AF',
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    fontWeight: '400',
  },
  statsAndActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  patientIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientsText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
  selectorWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
