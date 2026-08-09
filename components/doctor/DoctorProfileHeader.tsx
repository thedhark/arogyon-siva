import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Share as RNShare } from 'react-native';
import { ArrowLeft, Bookmark, Share2, Star, CheckCircle2, MapPin, Globe, ShieldCheck, Award, Users, Video, Building2, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  doctorData: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorProfileHeader({ doctorData, colors, isDark }: Props) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Book an appointment with ${doctorData.name} (${doctorData.speciality}) on Arogyon!`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Top Floating Action Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)' }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Expert Profile</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)' }]}
            onPress={() => setIsBookmarked(!isBookmarked)}
            activeOpacity={0.8}
          >
            <Bookmark size={20} color={isBookmarked ? '#10B981' : colors.text} fill={isBookmarked ? '#10B981' : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)' }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Full-Width Hero Image & Details Card */}
      <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
        
        {/* Prominent Hero Photo Header */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: doctorData.image }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', isDark ? 'rgba(30,30,30,0.85)' : 'rgba(0,0,0,0.45)']}
            style={styles.heroOverlay}
          />

          {/* Floating Verified Badge Pill on Hero Image */}
          <View style={styles.verifiedBadgeOnImage}>
            <ShieldCheck size={14} color="#FFFFFF" />
            <Text style={styles.verifiedBadgeText}>Verified Specialist</Text>
          </View>
        </View>

        {/* Doctor Information Section */}
        <View style={styles.infoContent}>
          
          {/* Doctor Name & Verified Icon */}
          <View style={styles.nameContainer}>
            <Text style={[styles.doctorName, { color: colors.text }]}>{doctorData.name}</Text>
            {doctorData.verified && <CheckCircle2 size={20} color="#10B981" fill="#D1FAE5" style={{ marginLeft: 6 }} />}
          </View>

          {/* Speciality */}
          <Text style={styles.specialityText}>{doctorData.speciality}</Text>

          {/* Truncated Description Paragraph with Read More */}
          <View style={styles.descriptionContainer}>
            <Text 
              style={[styles.descriptionText, { color: isDark ? '#9CA3AF' : '#4B5563' }]}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {doctorData.about}
            </Text>
            {doctorData.about?.length > 70 && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7} style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>{isExpanded ? 'Show Less' : 'Read More...'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Key Quick Stats Strip (Removed Experience per request, kept Reviews & Patients) */}
          <View style={[styles.statsStrip, { backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB', borderColor: isDark ? '#3A3A3A' : '#F3F4F6' }]}>
            <View style={styles.statCell}>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={[styles.statVal, { color: colors.text }]}>{doctorData.rating}</Text>
              </View>
              <Text style={styles.statLbl}>{doctorData.reviews} patient reviews</Text>
            </View>

            <View style={styles.cellDivider} />

            <View style={styles.statCell}>
              <View style={styles.ratingBadge}>
                <Users size={14} color="#10B981" />
                <Text style={[styles.statVal, { color: colors.text }]}>{doctorData.patients}</Text>
              </View>
              <Text style={styles.statLbl}>Happy Patients</Text>
            </View>
          </View>

          {/* Location & Languages info footer */}
          <View style={styles.locationStrip}>
            <View style={styles.locationItem}>
              <MapPin size={14} color="#10B981" />
              <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
                {doctorData.location}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <Globe size={14} color="#3B82F6" />
              <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
                {doctorData.languages}
              </Text>
            </View>
          </View>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 32,
    paddingBottom: 8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  heroCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  heroImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  verifiedBadgeOnImage: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  prevTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  prevTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  specialityText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  satisfactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  greenPillBar: {
    width: 36,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  satisfactionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  weOfferContainer: {
    marginBottom: 14,
  },
  weOfferTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  weOfferChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weOfferChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  weOfferChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  statCell: {
    alignItems: 'center',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  cellDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  locationStrip: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  readMoreBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
});
