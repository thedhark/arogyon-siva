import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Share as RNShare } from 'react-native';
import { ArrowLeft, Bookmark, Share2, ThumbsUp } from 'lucide-react-native';
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

export default function DoctorHeroCard({ doctor, colors, isDark, onBackPress }: DoctorHeroCardProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await RNShare.share({
        message: `Book a consultation with ${doctor.name} (${doctor.specialty || doctor.speciality}) on Arogyon!`,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  const handleBookmarkToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBookmarked(prev => !prev);
  };

  const doctorSpecialty = doctor.specialty || doctor.speciality || 'Orthopedic Surgeon';
  const doctorAbout = doctor.about || 'Orthopedic surgeon with extensive experience in joint replacement, spine, and trauma care.';
  const approvalRating = doctor.approvalRating || (doctor.rating ? `${Math.round(doctor.rating * 20)}%` : '97%');

  return (
    <View style={styles.container}>
      {/* Top Navigation Row */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
          onPress={() => (onBackPress ? onBackPress() : router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#1E293B'} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={handleBookmarkToggle}
            activeOpacity={0.8}
          >
            <Bookmark
              size={19}
              color={isBookmarked ? '#10B981' : (isDark ? '#F8FAFC' : '#1E293B')}
              fill={isBookmarked ? '#10B981' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Share2 size={19} color={isDark ? '#F8FAFC' : '#1E293B'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Doctor Info Row: Avatar + Details */}
      <View style={styles.profileRow}>
        <Image
          source={resolveImageSource(
            doctor.image,
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80'
          )}
          style={styles.avatarImage}
          resizeMode="cover"
        />

        <View style={styles.doctorInfoCol}>
          {/* Doctor Name */}
          <Text style={[styles.doctorName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {doctor.name}
          </Text>

          {/* Specialty */}
          <Text style={[styles.specialtyText, { color: isDark ? '#94A3B8' : '#334155' }]}>
            {doctorSpecialty}
          </Text>

          {/* Bio text */}
          <Text
            style={[styles.bioText, { color: isDark ? '#94A3B8' : '#475569' }]}
            numberOfLines={isAboutExpanded ? undefined : 2}
          >
            {doctorAbout}
          </Text>

          {/* See more toggle */}
          <TouchableOpacity
            onPress={() => setIsAboutExpanded(!isAboutExpanded)}
            activeOpacity={0.7}
            style={styles.seeMoreBtn}
          >
            <Text style={styles.seeMoreText}>
              {isAboutExpanded ? 'See less' : 'See more'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Approval Rating Box */}
      <View
        style={[
          styles.ratingCard,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.thumbsUpSquare}>
          <ThumbsUp size={18} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.ratingTextCol}>
          <Text style={[styles.ratingValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {approvalRating}
          </Text>
          <Text style={[styles.ratingLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Approval rating
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    marginBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  doctorInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 19,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  specialtyText: {
    fontSize: 13.5,
    fontFamily: Fonts.medium,
    fontWeight: '600',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: Fonts.regular,
  },
  seeMoreBtn: {
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
    color: '#2563EB',
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  thumbsUpSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingTextCol: {
    justifyContent: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  ratingLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    marginTop: 1,
  },
});
