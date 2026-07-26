import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Heart, Share, Star, CheckCircle2, MapPin, Globe, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  doctorData: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorProfileHeader({ doctorData, colors, isDark }: Props) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={[styles.headerBtn, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Doctor Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}>
            <Heart size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}>
            <Share size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Doctor Info Card (No Cover Photo!) */}
      <View style={[styles.profileCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
        <View style={styles.cardTop}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: doctorData.image }} style={styles.cardAvatar} />
            <View style={styles.badgeTag}>
              <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.badgeTagText}>{doctorData.rating}</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{doctorData.name}</Text>
              {doctorData.verified && <CheckCircle2 size={18} color="#10B981" fill="#D1FAE5" style={{ marginLeft: 4 }} />}
            </View>
            <Text style={styles.speciality}>{doctorData.speciality}</Text>
            
            {/* Rating and Reviews */}
            <View style={styles.ratingRow}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.ratingValue, { color: colors.text }]}>{doctorData.rating}</Text>
              <Text style={styles.reviewsText}>({doctorData.reviews} reviews)</Text>
              <View style={styles.verifiedChip}>
                <ShieldCheck size={12} color="#10B981" />
                <Text style={styles.verifiedChipText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location & Languages Row */}
        <View style={[styles.detailsStrip, { borderTopColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={styles.detailItem}>
            <MapPin size={15} color="#10B981" />
            <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
              {doctorData.location.includes(',') ? doctorData.location.split(',')[1].trim() : doctorData.location}
            </Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Globe size={15} color="#3B82F6" />
            <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
              {doctorData.languages}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  profileCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  cardAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
  },
  badgeTag: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
  },
  speciality: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  detailsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
  },
});

