import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Share } from 'react-native';
import { MapPin, Globe, Bookmark, Share2, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/responsive';
import BookVisitSelector, { SelectedPatientInfo } from '@/components/booking/BookVisitSelector';
import { useBookingStore } from '@/hooks/useBookingStore';

export interface DoctorData {
  id: string;
  name: string;
  speciality: string;
  emoji?: string;
  fee: string | number;
  hospitalName?: string;
  location?: string;
  languages?: string;
  image: string;
  availableSlots?: string[];
  nextAvailableTime?: string;
}

interface Props {
  doctor: DoctorData;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onBookVisitPress: (doctor: DoctorData, selectedSlot?: string, patient?: SelectedPatientInfo, count?: number) => void;
  onCardPress?: (doctor: DoctorData) => void;
  hideLocation?: boolean;
}

export default function RecommendedDoctorCard({
  doctor,
  isBookmarked = false,
  onBookmarkToggle,
  onBookVisitPress,
  onCardPress,
  hideLocation = false,
}: Props) {
  const { colors, isDark } = useTheme();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const cartItems = useBookingStore((state) => state.cartItems);
  const docCartItems = cartItems.filter(
    (ci) => ci.type === 'visit' && (ci.itemId.startsWith(doctor.id) || ci.title === doctor.name)
  );
  const assignedIds = docCartItems.map((ci) => ci.assignedPatientId || 'me');

  const availableTimeText =
    doctor.nextAvailableTime ||
    (doctor.availableSlots && doctor.availableSlots.length > 0
      ? doctor.availableSlots[0]
      : '10:00 AM');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Book a visit with ${doctor.name} (${doctor.speciality}) at ${doctor.hospitalName || doctor.location || 'Arogyon Clinic'} on Arogyon Premium!`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmarkToggle) onBookmarkToggle();
  };

  const doctorEmoji =
    doctor.emoji ||
    (doctor.speciality.toLowerCase().includes('cardio')
      ? '🫀'
      : doctor.speciality.toLowerCase().includes('nephro') || doctor.speciality.toLowerCase().includes('uro')
      ? '🫘'
      : doctor.speciality.toLowerCase().includes('neuro')
      ? '🧠'
      : doctor.speciality.toLowerCase().includes('gynaec')
      ? '🤰'
      : doctor.speciality.toLowerCase().includes('derma') || doctor.speciality.toLowerCase().includes('skin')
      ? '✨'
      : '🩺');

  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        {/* Left Info Column (Clickable to open Doctor Details) */}
        <TouchableOpacity
          style={styles.infoCol}
          activeOpacity={0.8}
          onPress={() => onCardPress?.(doctor)}
        >
          {/* Doctor Name & Emoji */}
          <View style={styles.nameRow}>
            <Text style={[styles.doctorName, { color: colors.text }]} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={styles.emojiText}>{doctorEmoji}</Text>
          </View>

          {/* Specialty */}
          <Text style={styles.specialtyText} numberOfLines={1}>
            {doctor.speciality}
          </Text>

          {/* Fee Row */}
          <View style={styles.feeRow}>
            <Text style={[styles.feeVal, { color: colors.text }]}>
              ₹{doctor.fee}
            </Text>
            <Text style={styles.feeDot}>•</Text>
            <Text style={styles.feeLabel}>Consultation fee</Text>
          </View>

          {/* Location Row */}
          {!hideLocation && (
            <View style={styles.detailRow}>
              <MapPin size={12} color="#64748B" style={styles.detailIcon} />
              <Text style={styles.detailText} numberOfLines={1}>
                {doctor.hospitalName || doctor.location || 'Apollo Hospitals, Banjara Hills'}
              </Text>
            </View>
          )}

          {/* Languages Row */}
          <View style={styles.detailRow}>
            <Globe size={12} color="#64748B" style={styles.detailIcon} />
            <Text style={styles.detailText} numberOfLines={1}>
              {doctor.languages || 'English • Hindi • Telugu'}
            </Text>
          </View>

          {/* Single Clean Availability Line */}
          <View style={styles.availabilityRow}>
            <Calendar size={12} color={isDark ? '#60A5FA' : '#2563EB'} style={styles.detailIcon} />
            <Text style={[styles.availabilityText, { color: isDark ? '#94A3B8' : '#475569' }]}>
              Next avail: <Text style={[styles.timeHighlight, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>{availableTimeText}</Text>
            </Text>
          </View>

          {/* Left Action Buttons (Bookmark & Share) */}
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { borderColor: isDark ? '#3F3F46' : '#E2E8F0', backgroundColor: isDark ? '#27272A' : '#FFFFFF' },
              ]}
              onPress={handleToggleBookmark}
              activeOpacity={0.7}
            >
              <Bookmark
                size={16}
                color={bookmarked ? (isDark ? '#60A5FA' : '#2563EB') : (isDark ? '#CBD5E1' : '#475569')}
                fill={bookmarked ? (isDark ? '#60A5FA' : '#2563EB') : 'transparent'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconBtn,
                { borderColor: isDark ? '#3F3F46' : '#E2E8F0', backgroundColor: isDark ? '#27272A' : '#FFFFFF' },
              ]}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={16} color={isDark ? '#CBD5E1' : '#475569'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Right Column: Doctor Portrait Photo + Floating Book Visit Selector */}
        <View style={styles.rightCol}>
          <TouchableOpacity
            style={styles.portraitWrapper}
            activeOpacity={0.8}
            onPress={() => onCardPress?.(doctor)}
          >
            <Image
              source={{ uri: doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400' }}
              style={styles.portraitImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Floating Action Button (Overlapping bottom edge of image) */}
          <View style={styles.floatingButtonContainer}>
            <BookVisitSelector
              buttonLabel="VISIT"
              initialSelectedIds={assignedIds}
              initialCount={assignedIds.length}
              onBookPress={(patient) => onBookVisitPress(doctor, availableTimeText, patient, 1)}
              onCountChange={(count, patient) => {
                if (count > 0) {
                  onBookVisitPress(doctor, availableTimeText, patient, count);
                }
              }}
            />
          </View>
        </View>
      </View>

      {/* Minimal Thin Separator Line with Breaks */}
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    overflow: 'visible',
  },
  dividerLine: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  doctorName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 22,
  },
  emojiText: {
    fontSize: 15,
    marginLeft: 4,
  },
  specialtyText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 5,
    lineHeight: 16.5,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  feeVal: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  feeDot: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 5,
  },
  feeLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    flex: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 7,
  },
  availabilityText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },
  timeHighlight: {
    fontFamily: Fonts.bold,
    color: '#2563EB',
    fontWeight: '700',
  },
  leftActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    width: scale(163),
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 22,
  },
  portraitWrapper: {
    width: '100%',
    height: verticalScale(156),
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EFECE9',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  floatingButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -21,
    zIndex: 2,
    elevation: 2,
  },
});
