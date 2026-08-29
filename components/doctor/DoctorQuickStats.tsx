import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Users, Award, ThumbsUp } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';

interface DoctorQuickStatsProps {
  doctor: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorQuickStats({ doctor, colors, isDark }: DoctorQuickStatsProps) {
  const rating = doctor.rating || '4.8';
  const reviewsCount = doctor.reviews || doctor.reviewsCount || '1.2K';
  const patientsCount = doctor.patientsTreated || doctor.patients || '10,000+';
  const experienceYears = doctor.experience || '10+ Years Exp';

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#1E1E24' : '#F9FAFB',
            borderColor: isDark ? '#2D2D35' : '#E5E7EB',
          },
        ]}
      >
        {/* Rating Cell */}
        <View style={styles.cell}>
          <View style={styles.statIconRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.text }]}>{rating}</Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {reviewsCount} Reviews
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#33333F' : '#E5E7EB' }]} />

        {/* Patients Cell */}
        <View style={styles.cell}>
          <View style={styles.statIconRow}>
            <Users size={14} color="#10B981" />
            <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
              {patientsCount}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Patients Served
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#33333F' : '#E5E7EB' }]} />

        {/* Experience Cell */}
        <View style={styles.cell}>
          <View style={styles.statIconRow}>
            <Award size={14} color="#3B82F6" />
            <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
              {experienceYears.replace(/\s*exp/i, '')}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Experience
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#33333F' : '#E5E7EB' }]} />

        {/* Recommendation Cell */}
        <View style={styles.cell}>
          <View style={styles.statIconRow}>
            <ThumbsUp size={13} color="#8B5CF6" />
            <Text style={[styles.statValue, { color: colors.text }]}>98%</Text>
          </View>
          <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Recommended
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 28,
  },
});
