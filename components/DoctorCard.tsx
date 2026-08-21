import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, Flame, Zap, ThumbsUp, User, Calendar, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import RecommendedDoctorCard, { DoctorData } from '@/components/hospital/RecommendedDoctorCard';

export interface DoctorCardData {
  id?: string;
  name: string;
  speciality?: string;
  title?: string;
  degrees?: string;
  location?: string;
  hospital?: string;
  rating?: string | number;
  reviews?: string | number;
  price?: string | number;
  fee?: string | number;
  nextAvailable?: string;
  image?: string;
  tagType?: 'fire' | 'zap' | 'thumb' | string;
  tagText?: string;
  tag?: string;
  languages?: string;
  emoji?: string;
}

interface DoctorCardProps {
  doc: DoctorCardData;
  isDark?: boolean;
  colors?: any;
  isLiked?: boolean;
  onPress: () => void;
  onLikePress?: () => void;
  onAddPress?: (selectedSlot?: string) => void;
  variant?: 'default' | 'hospital' | 'expert' | 'recommended';
  ctaText?: string;
}

export default function DoctorCard({
  doc,
  isDark: isDarkProp,
  colors: colorsProp,
  isLiked = false,
  onPress,
  onLikePress,
  onAddPress,
  variant = 'default',
  ctaText = 'ADD VISIT',
}: DoctorCardProps) {
  const theme = useTheme();
  const isDark = isDarkProp ?? theme.isDark;
  const colors = colorsProp ?? theme.colors;

  if (variant === 'recommended') {
    const recommendedData: DoctorData = {
      id: doc.id || 'doc-1',
      name: doc.name,
      speciality: doc.speciality || 'Specialist',
      fee: doc.fee || doc.price || '800',
      hospitalName: doc.hospital || doc.location || 'Apollo Hospitals, Banjara Hills',
      location: doc.location || 'Banjara Hills',
      languages: doc.languages || 'English • Hindi • Telugu',
      image: doc.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
      emoji: doc.emoji,
      availableSlots: ['10:00 AM', '12:30 PM', '05:00 PM'],
    };

    return (
      <RecommendedDoctorCard
        doctor={recommendedData}
        isBookmarked={isLiked}
        onBookmarkToggle={onLikePress}
        onCardPress={onPress}
        onBookVisitPress={(d, slot) => {
          if (onAddPress) onAddPress(slot);
        }}
      />
    );
  }

  const docName = doc?.name || 'Doctor';
  const docSpeciality = doc?.speciality || 'Specialist';
  const docDegrees = doc?.degrees || doc?.location || 'In-Clinic';
  const docRating = doc?.rating || '4.8';
  const docReviews = doc?.reviews || '100+';
  const docPrice = doc?.price || doc?.fee || '500';
  const docNextAvailable = doc?.nextAvailable || 'Today';

  const isHospitalVariant = variant === 'hospital';
  const gradientColors = isHospitalVariant
    ? ['#9BF229', '#14CE65']
    : (isDark ? ['#4338CA', '#3730A3'] : ['#6366F1', '#4F46E5']);
  const textColor = isHospitalVariant ? '#052E16' : '#FFFFFF';

  return (
    <TouchableOpacity 
      style={[
        styles.docCard, 
        { 
          backgroundColor: isHospitalVariant ? 'transparent' : (isDark ? '#1E1E1E' : '#FFFFFF'),
          borderColor: isHospitalVariant ? (isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9') : (isDark ? '#27272A' : '#F3F4F6'),
          borderWidth: isHospitalVariant ? 0 : 1,
          borderBottomWidth: 1,
          elevation: isHospitalVariant ? 0 : 1,
          shadowOpacity: isHospitalVariant ? 0 : 0.04,
          marginVertical: isHospitalVariant ? 2 : 0,
        }
      ]}
      onPress={onPress}
    >
      {/* Top Info Section */}
      <View style={styles.docCardTop}>
        <View style={styles.docLeft}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: doc?.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200' }} style={styles.docAvatar} />
            <View style={styles.onlineDot} />
          </View>
        </View>
        
        <View style={styles.docInfo}>
          <View style={styles.docHeaderRow}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>{docName}</Text>
            </View>
            <TouchableOpacity onPress={onLikePress} style={{ paddingLeft: 8 }}>
              <Heart size={20} color={isLiked ? "#EF4444" : "#6B7280"} fill={isLiked ? "#EF4444" : "transparent"} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.docSpecialty}>{docSpeciality}</Text>
          <Text style={styles.docDegrees}>{docDegrees}</Text>
          
          <View style={styles.docStatsRow}>
            <LinearGradient
              colors={['#9BF229', '#14CE65']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ratingBadge, { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }]}
            >
              <Star size={11} color="#052E16" fill="#052E16" />
              <Text style={[styles.docRating, { color: '#052E16' }]}>{docRating}</Text>
            </LinearGradient>
            <Text style={styles.docReviews}>({docReviews} reviews)</Text>
            
            {doc?.tagType === 'fire' && (
              <View style={[styles.highlightTag, { backgroundColor: '#ECFDF5' }]}>
                <Flame size={12} color="#10B981" fill="#10B981" />
                <Text style={[styles.highlightTagText, { color: '#10B981' }]}>{doc?.tagText || 'Top Rated'}</Text>
              </View>
            )}
            {doc?.tagType === 'zap' && (
              <View style={[styles.highlightTag, { backgroundColor: '#EFF6FF' }]}>
                <Zap size={12} color="#3B82F6" fill="#3B82F6" />
                <Text style={[styles.highlightTagText, { color: '#3B82F6' }]}>{doc?.tagText || 'Popular'}</Text>
              </View>
            )}
            {doc?.tagType === 'thumb' && (
              <View style={[styles.highlightTag, { backgroundColor: '#FFF7ED' }]}>
                <ThumbsUp size={12} color="#F97316" fill="#F97316" />
                <Text style={[styles.highlightTagText, { color: '#F97316' }]}>{doc?.tagText || 'Recommended'}</Text>
              </View>
            )}
          </View>
          
        </View>
      </View>

      {/* Dashed Divider */}
      <View style={styles.dashedDivider} />

      {/* Bottom Action Section */}
      <View style={styles.docCardBottom}>
        <View style={styles.feeCol}>
          <Text style={[styles.bottomColVal, { color: colors.text }]}>₹{docPrice}</Text>
          <Text style={styles.bottomColLabel}>Consultation Fee</Text>
        </View>
        
        <View style={styles.verticalDivider} />
        
        <View style={styles.availabilityCol}>
          <Text style={[styles.bottomColVal, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{docNextAvailable}</Text>
          <Text style={styles.bottomColLabel}>Next Available</Text>
        </View>
        
        {/* Tactile Reshaped Beveled Pill Button */}
        <TouchableOpacity
          style={[
            styles.bookGradientBtn,
            isHospitalVariant && styles.hospitalBtnShadow,
          ]}
          onPress={() => onAddPress ? onAddPress() : onPress()}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookBtnInner}
          >
            <Calendar size={14} color={textColor} style={{ marginRight: 4 }} />
            <Text style={[styles.bookBtnText, { color: textColor }]}>{ctaText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  docCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  docCardTop: {
    flexDirection: 'row',
    padding: 14,
  },
  docLeft: {
    width: '34%',
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
    width: '100%',
  },
  docAvatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  docInfo: {
    flex: 1,
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  docName: {
    fontFamily: Fonts.bold,
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  docSpecialty: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 2,
  },
  docDegrees: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  docStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docRating: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  docReviews: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#6B7280',
  },
  highlightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highlightTagText: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },

  dashedDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  docCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'transparent',
  },
  feeCol: {
    // Auto width
  },
  availabilityCol: {
    flex: 1,
  },
  bottomColVal: {
    fontFamily: Fonts.semiBold,
    fontSize: 14.5,
    fontWeight: '600',
  },
  bottomColLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  bookGradientBtn: {
    borderRadius: 999, // Reshaped tactile rounded pill style
    marginLeft: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  hospitalBtnShadow: {
    shadowColor: '#14CE65',
    shadowOpacity: 0.3,
  },
  bookBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9.5,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bookBtnText: {
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
