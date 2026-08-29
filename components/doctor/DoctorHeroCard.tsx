import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Share as RNShare } from 'react-native';
import { ArrowLeft, Bookmark, Share2, CheckCircle2, ShieldCheck, MapPin, Building2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/theme';
import { resolveImageSource } from '@/utils/imageUtils';

interface DoctorHeroCardProps {
  doctor: any;
  colors: any;
  isDark: boolean;
  onBackPress?: () => void;
}

export default function DoctorHeroCard({ doctor, colors, isDark, onBackPress }: DoctorHeroCardProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await RNShare.share({
        message: `Book a priority consultation with ${doctor.name} (${doctor.specialty || doctor.speciality}) on Arogyon!`,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  const handleBookmarkToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBookmarked(prev => !prev);
  };

  const doctorSpecialty = doctor.specialty || doctor.speciality || 'Specialist';
  const doctorHospital = doctor.hospital || doctor.hospitalName || 'Apollo Hospital';
  const doctorLocation = doctor.location || 'Bangalore';
  const doctorQualification = doctor.qualification || doctor.degrees || 'MBBS, MD';
  const doctorAbout = doctor.about || `${doctor.name} is a certified specialist dedicated to providing exceptional, evidence-based care with a focus on patient wellness and modern treatment protocols.`;

  return (
    <View style={styles.container}>
      {/* Floating Action Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(30,30,35,0.85)' : 'rgba(255,255,255,0.92)' }]}
          onPress={() => onBackPress ? onBackPress() : router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Doctor Profile
        </Text>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(30,30,35,0.85)' : 'rgba(255,255,255,0.92)' }]}
            onPress={handleBookmarkToggle}
            activeOpacity={0.8}
          >
            <Bookmark
              size={19}
              color={isBookmarked ? '#10B981' : colors.text}
              fill={isBookmarked ? '#10B981' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(30,30,35,0.85)' : 'rgba(255,255,255,0.92)' }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Share2 size={19} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Visual Card */}
      <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? '#2C2C2E' : '#E5E7EB' }]}>
        {/* Full Doctor Image with Gradient */}
        <View style={styles.imageContainer}>
          <Image
            source={resolveImageSource(doctor.image, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80')}
            style={styles.doctorImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', isDark ? '#1C1C1E' : 'rgba(15,23,42,0.85)']}
            locations={[0, 0.55, 1]}
            style={styles.imageOverlay}
          />

          {/* Floating Verified Badge */}
          <View style={styles.verifiedFloatingPill}>
            <ShieldCheck size={13} color="#FFFFFF" />
            <Text style={styles.verifiedFloatingText}>Verified Specialist</Text>
          </View>

          {/* Experience pill on top right */}
          {doctor.experience && (
            <View style={styles.experienceFloatingPill}>
              <Text style={styles.experienceFloatingText}>{doctor.experience}</Text>
            </View>
          )}
        </View>

        {/* Doctor Info Body */}
        <View style={styles.infoBody}>
          <View style={styles.nameRow}>
            <Text style={[styles.doctorName, { color: colors.text }]} numberOfLines={1}>
              {doctor.name}
            </Text>
            <CheckCircle2 size={20} color="#10B981" fill="#D1FAE5" style={{ marginLeft: 6 }} />
          </View>

          {/* Specialty & Degrees */}
          <Text style={[styles.specialtyText, { color: isDark ? '#93C5FD' : '#2563EB' }]}>
            {doctorSpecialty} • <Text style={{ color: isDark ? '#9CA3AF' : '#64748B', fontWeight: '500' }}>{doctorQualification}</Text>
          </Text>

          {/* Hospital & Location */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Building2 size={13.5} color="#10B981" />
              <Text style={[styles.metaText, { color: colors.text }]} numberOfLines={1}>
                {doctorHospital}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={13.5} color="#6366F1" />
              <Text style={[styles.metaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={1}>
                {doctorLocation}
              </Text>
            </View>
          </View>

          {/* Bio Description with expandable read more */}
          <View style={styles.bioContainer}>
            <Text
              style={[styles.bioText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}
              numberOfLines={isAboutExpanded ? undefined : 2}
            >
              {doctorAbout}
            </Text>
            {doctorAbout.length > 80 && (
              <TouchableOpacity onPress={() => setIsAboutExpanded(!isAboutExpanded)} activeOpacity={0.7} style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>{isAboutExpanded ? 'Show Less' : 'Read More...'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 230,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  verifiedFloatingPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedFloatingText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  experienceFloatingPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  experienceFloatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '600',
  },
  infoBody: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 21,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  specialtyText: {
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
  bioContainer: {
    marginTop: 2,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.regular,
  },
  readMoreBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#10B981',
  },
});
