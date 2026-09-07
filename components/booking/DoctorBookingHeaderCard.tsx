import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Users, Languages, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { resolveImageSource } from '@/utils/imageUtils';

interface DoctorBookingHeaderCardProps {
  doctor: any;
  hospitalName?: string;
  isDark?: boolean;
}

function formatPatientsInK(raw: any): string {
  if (!raw) return '2.5K+';
  const str = String(raw).replace(/[^0-9]/g, '');
  const num = parseInt(str, 10);
  if (!num || isNaN(num)) return '2.5K+';
  if (num >= 1000) {
    const inK = (num / 1000).toFixed(num % 1000 >= 100 ? 1 : 0);
    return `${inK}K+`;
  }
  return `${num}+`;
}

function formatLanguagesCompact(raw: any): string {
  if (!raw) return 'Eng, Hin';
  const list: string[] = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
    ? raw.split(',').map((s) => s.trim())
    : [];

  if (list.length === 0) return 'Eng, Hin';

  const shortMap: Record<string, string> = {
    english: 'Eng',
    hindi: 'Hin',
    tamil: 'Tam',
    telugu: 'Tel',
    kannada: 'Kan',
    malayalam: 'Mal',
    bengali: 'Ben',
    marathi: 'Mar',
    gujarati: 'Guj',
    spanish: 'Span',
    french: 'Fr',
  };

  const shortList = list.map((l) => shortMap[l.toLowerCase()] || l.slice(0, 3));
  if (shortList.length <= 2) {
    return shortList.join(', ');
  }
  return `${shortList.slice(0, 2).join(', ')} +${shortList.length - 2}`;
}

export default function DoctorBookingHeaderCard({
  doctor,
  hospitalName: hospitalNameProp = 'Apollo Clinic',
  isDark: isDarkProp,
}: DoctorBookingHeaderCardProps) {
  const { isDark: themeDark } = useTheme();
  const isDark = isDarkProp ?? themeDark;

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  if (!doctor) return null;

  const docName = doctor?.name || doctor?.title || 'Dr. William Jame';
  const docSpeciality =
    doctor?.specialty || doctor?.speciality || doctor?.degrees || 'Senior General Physician';
  const docImage = resolveImageSource(
    doctor?.image,
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80'
  );

  const patientsCount = formatPatientsInK(
    doctor?.patientsTreated || doctor?.patients || doctor?.patientCount
  );
  const languagesText = formatLanguagesCompact(doctor?.languages);

  const ratingValue = doctor?.rating
    ? typeof doctor.rating === 'number'
      ? doctor.rating.toFixed(1)
      : doctor.rating
    : '4.8';

  const hospitalName =
    doctor?.hospitalName || doctor?.hospital || hospitalNameProp || 'Apollo Clinic';

  const doctorAbout =
    doctor?.about ||
    doctor?.bio ||
    `${docName} is a board-certified specialist at ${hospitalName} with extensive expertise in ${docSpeciality.toLowerCase()}. Specializing in comprehensive diagnostics, compassionate patient care, and modern evidence-based therapeutic treatments.`;

  const toggleAbout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAboutExpanded(prev => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* 1. Unified Doctor Profile Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#16181D' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
          },
        ]}
      >
        {/* Full-width image at top touching left and right without inner borders */}
        <Image
          source={docImage}
          style={styles.fullWidthPhoto}
          contentFit="cover"
          transition={200}
        />

        {/* Card Body containing Doctor Name, Specialty, and compact stretchable Stats */}
        <View style={styles.cardBody}>
          {/* Doctor Identity */}
          <View style={styles.identityRow}>
            <Text
              style={[styles.doctorName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              numberOfLines={1}
            >
              {docName}
            </Text>
            <Text
              style={[styles.doctorSpecialty, { color: isDark ? '#94A3B8' : '#64748B' }]}
            >
              {docSpeciality}
            </Text>
          </View>

          {/* 3 Clean, Compact & Stretchable Stats Badges */}
          <View style={styles.statsRow}>
            {/* Patients in K */}
            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                },
              ]}
            >
              <Users size={14} color="#3B82F6" />
              <View style={styles.statTextCol}>
                <Text
                  style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  numberOfLines={1}
                >
                  {patientsCount}
                </Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
            </View>

            {/* Languages (compact & stretchable) */}
            <View
              style={[
                styles.statPill,
                styles.statPillFlexible,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                },
              ]}
            >
              <Languages size={14} color="#8B5CF6" />
              <View style={styles.statTextCol}>
                <Text
                  style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {languagesText}
                </Text>
                <Text style={styles.statLabel}>Languages</Text>
              </View>
            </View>

            {/* Rating */}
            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                },
              ]}
            >
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <View style={styles.statTextCol}>
                <Text
                  style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                  numberOfLines={1}
                >
                  {ratingValue}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. About Section (Directly Below Card) */}
      <View style={styles.aboutContainer}>
        <Text style={[styles.aboutTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          About
        </Text>
        <Text
          style={[styles.aboutText, { color: isDark ? '#94A3B8' : '#475569' }]}
          numberOfLines={isAboutExpanded ? undefined : 3}
        >
          {doctorAbout}
        </Text>
        {doctorAbout.length > 90 && (
          <TouchableOpacity
            onPress={toggleAbout}
            activeOpacity={0.7}
            style={styles.moreBtn}
          >
            <Text style={styles.moreBtnText}>
              {isAboutExpanded ? 'Show Less' : '...More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  fullWidthPhoto: {
    width: '100%',
    height: 230,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  identityRow: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  doctorSpecialty: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 7,
    gap: 6,
    minWidth: 0,
  },
  statPillFlexible: {
    flex: 1.15,
  },
  statTextCol: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  statValue: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    color: '#94A3B8',
    marginTop: 1,
  },
  aboutContainer: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
  moreBtn: {
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  moreBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    color: '#2563EB',
    fontWeight: '600',
  },
});
