import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ChevronLeft, Bell, Users, Languages, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/theme';
import { resolveImageSource } from '@/utils/imageUtils';

interface DoctorHeroCardProps {
  doctor: any;
  colors: any;
  isDark: boolean;
  onBackPress?: () => void;
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

export default function DoctorHeroCard({
  doctor,
  colors,
  isDark,
  onBackPress,
}: DoctorHeroCardProps) {
  const router = useRouter();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const doctorName = doctor?.name || 'Dr. William Jame';
  const doctorSpecialty =
    doctor?.specialty || doctor?.speciality || 'Neurologist';
  const doctorAbout =
    doctor?.about ||
    `${doctorName} is a board-certified specialist with over 12 years of experience in clinical care and advanced treatment protocols. Specializing in comprehensive diagnostics, compassionate patient care, and modern evidence-based therapeutic treatments.`;

  const patientsCount = formatPatientsInK(doctor?.patients || doctor?.patientsTreated);
  const languagesText = formatLanguagesCompact(doctor?.languages);

  const ratingValue = doctor?.rating
    ? typeof doctor.rating === 'number'
      ? doctor.rating.toFixed(1)
      : doctor.rating
    : '4.8';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/notifications');
  };

  const toggleAbout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAboutExpanded(prev => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* 1. Header Bar: Back Button, Title, Notification Bell */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.roundBtn,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
            },
          ]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={isDark ? '#F8FAFC' : '#1E293B'} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          Doctor Details
        </Text>

        <TouchableOpacity
          style={[
            styles.roundBtn,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
            },
          ]}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Bell size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
        </TouchableOpacity>
      </View>

      {/* 2. Unified Doctor Profile Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
          },
        ]}
      >
        {/* Full-width image at top touching left and right without inner borders */}
        <Image
          source={resolveImageSource(
            doctor?.image,
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80'
          )}
          style={styles.fullWidthPhoto}
          resizeMode="cover"
        />

        {/* Card Body containing Doctor Name, Specialty, and compact stretchable Stats */}
        <View style={styles.cardBody}>
          {/* Doctor Identity */}
          <View style={styles.identityRow}>
            <Text
              style={[styles.doctorName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              numberOfLines={1}
            >
              {doctorName}
            </Text>
            <Text
              style={[styles.doctorSpecialty, { color: isDark ? '#94A3B8' : '#64748B' }]}
            >
              {doctorSpecialty}
            </Text>
          </View>

          {/* 3 Clean, Compact & Stretchable Stats Badges */}
          <View style={styles.statsRow}>
            {/* Patients Stat in K */}
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

            {/* Languages Stat (compact & stretchable) */}
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

            {/* Rating Stat */}
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

      {/* 3. About Section (Directly Below Card) */}
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
    marginBottom: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 24,
    paddingBottom: 12,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    marginBottom: 16,
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
