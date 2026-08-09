import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Hospital, MapPin, BadgeCheck, Star, Award, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  hospitalName: string;
  hospitalLocation: string;
  doctorName?: string;
  doctorSpeciality?: string;
  rating?: string;
  reviews?: string;
  isDark: boolean;
  colors: any;
}

export default function PackageHospitalInfoCard({
  hospitalName,
  hospitalLocation,
  doctorName = 'Dr. Priya Sharma',
  doctorSpeciality = 'Chief Medical Director & Specialist',
  rating = '4.8',
  reviews = '2,400+ Reviews',
  isDark,
  colors,
}: Props) {
  const router = useRouter();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: 'transparent',
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.hospitalLogoBox}>
          <Hospital size={22} color="#0D9488" />
        </View>

        <View style={styles.hospitalDetails}>
          <View style={styles.hospitalTitleRow}>
            <Text style={[styles.hospitalName, { color: colors.text }]} numberOfLines={1}>
              {hospitalName}
            </Text>
            <BadgeCheck size={16} color="#00A981" fill="#E6F6F2" />
          </View>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {hospitalLocation}
            </Text>
          </View>
        </View>

        <View style={styles.ratingBadge}>
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      <View style={[styles.accreditationBanner, { backgroundColor: isDark ? '#2A2A2A' : '#F0FDFA' }]}>
        <Award size={16} color="#0D9488" />
        <Text style={[styles.accreditationText, { color: colors.text }]}>
          NABH & JCI Accredited Hospital Partner
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />

      {/* Lead Specialist Doctor Info */}
      <View style={styles.doctorSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200' }}
          style={styles.doctorAvatar}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorHeading}>Lead Medical Specialist</Text>
          <Text style={[styles.doctorName, { color: colors.text }]}>{doctorName}</Text>
          <Text style={styles.doctorSpec}>{doctorSpeciality}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    marginBottom: 16,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hospitalLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hospitalDetails: {
    flex: 1,
  },
  hospitalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  accreditationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  accreditationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeading: {
    fontSize: 10,
    color: '#0D9488',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  doctorSpec: {
    fontSize: 11,
    color: '#6B7280',
  },
});
