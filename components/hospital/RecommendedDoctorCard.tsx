import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Share } from 'react-native';
import { MapPin, Globe, Bookmark, Share2, Plus, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

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
  onBookVisitPress: (doctor: DoctorData, selectedSlot?: string) => void;
  hideLocation?: boolean;
}

export default function RecommendedDoctorCard({
  doctor,
  isBookmarked = false,
  onBookmarkToggle,
  onBookVisitPress,
  hideLocation = false,
}: Props) {
  const { colors, isDark } = useTheme();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

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
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isDark ? '#27272A' : '#F1F5F9',
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Left Info Column */}
        <View style={styles.infoCol}>
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

          {/* Single Clean Availability Line (Replaced messy pills) */}
          <View style={styles.availabilityRow}>
            <Calendar size={12} color="#E11D48" style={styles.detailIcon} />
            <Text style={styles.availabilityText}>
              Available at <Text style={styles.timeHighlight}>{availableTimeText}</Text> today
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
                size={14}
                color={bookmarked ? '#E11D48' : (isDark ? '#CBD5E1' : '#475569')}
                fill={bookmarked ? '#E11D48' : 'transparent'}
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
              <Share2 size={14} color={isDark ? '#CBD5E1' : '#475569'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Column: Doctor Portrait Photo + Book Visit Button right below photo */}
        <View style={styles.rightCol}>
          <View style={styles.portraitWrapper}>
            <Image
              source={{ uri: doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400' }}
              style={styles.portraitImage}
              resizeMode="cover"
            />
          </View>

          {/* BOOK VISIT Button positioned directly under the photo */}
          <TouchableOpacity
            style={[
              styles.bookVisitBtn,
              { backgroundColor: isDark ? '#2D1B28' : '#FFF5F7' },
            ]}
            onPress={() => onBookVisitPress(doctor, availableTimeText)}
            activeOpacity={0.85}
          >
            <Text style={styles.bookVisitText}>BOOK VISIT</Text>
            <Plus size={13} color="#E11D48" strokeWidth={2.5} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
    paddingRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  emojiText: {
    fontSize: 15,
    marginLeft: 5,
  },
  specialtyText: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 6,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  feeVal: {
    fontFamily: Fonts.semiBold,
    fontSize: 13.5,
    fontWeight: '600',
  },
  feeDot: {
    fontSize: 11,
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
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '400',
    flex: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 8,
  },
  availabilityText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  timeHighlight: {
    fontFamily: Fonts.bold,
    color: '#E11D48',
    fontWeight: '700',
  },
  leftActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    width: 118,
    alignItems: 'center',
  },
  portraitWrapper: {
    width: '100%',
    height: 122,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EFECE9',
    marginBottom: 8,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  bookVisitBtn: {
    width: 98,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: '#FFF5F7',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bookVisitText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E11D48',
    letterSpacing: 0.2,
  },
});
