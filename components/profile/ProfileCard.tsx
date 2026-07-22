import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { CheckCircle2, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export default function ProfileCard() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {/* Background Stacked Card 2 (Bottom layer) */}
      <View style={[styles.bgCard2, { backgroundColor: isDark ? '#141414' : '#E8EEF5', borderColor: isDark ? '#262626' : '#D1DBE8' }]} />
      {/* Background Stacked Card 1 (Middle layer) */}
      <View style={[styles.bgCard1, { backgroundColor: isDark ? '#181818' : '#F1F5F9', borderColor: isDark ? '#2D2D2D' : '#E2E8F0' }]} />

      <View style={[
        styles.card, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333' : 'transparent',
          borderWidth: isDark ? 1 : 0,
        }
      ]}>
      {/* Top Profile Info */}
      <View style={styles.topRow}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250' }} 
          style={styles.avatar} 
        />
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>Ananya Sharma</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>28 Years • Female</Text>
          
          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={14} color="#10B981" fill="#10B981" style={styles.verifiedIcon} />
            <Text style={styles.verifiedText}>Profile Verified</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {/* Stat 1 */}
        <View style={[styles.statBox, { backgroundColor: isDark ? '#2A2A2A' : '#F9F9FF' }]}>
          <Text style={[styles.statLabel, { color: colors.text }]}>Care Plans</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
          <Text style={[styles.statSub, { color: colors.textMuted }]}>Active</Text>
        </View>

        {/* Stat 2 */}
        <View style={[styles.statBox, { backgroundColor: isDark ? '#2A2A2A' : '#F9F9FF' }]}>
          <Text style={[styles.statLabel, { color: colors.text }]}>Appointments</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
          <Text style={[styles.statSub, { color: colors.textMuted }]}>Completed</Text>
        </View>

        {/* Stat 3 */}
        <View style={[styles.statBox, { backgroundColor: isDark ? '#2A2A2A' : '#F9F9FF' }]}>
          <Text style={[styles.statLabel, { color: colors.text }]}>Health Score</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.statValue, { color: colors.text }]}>85</Text>
            <Text style={[styles.scoreTotal, { color: colors.textMuted }]}>/100</Text>
          </View>
          <View style={styles.scoreStatusRow}>
            <Text style={styles.scoreStatus}>Good</Text>
            <TrendingUp size={14} color="#10B981" strokeWidth={3} />
          </View>
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  bgCard1: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: -10,
    height: '100%',
    borderRadius: 24,
    borderWidth: 1,
    zIndex: -1,
  },
  bgCard2: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -18,
    height: '100%',
    borderRadius: 24,
    borderWidth: 1,
    zIndex: -2,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  editBtn: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Light green bg
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedIcon: {
    marginRight: 4,
    color: '#FFFFFF', // Inner checkmark color
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  scoreTotal: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  scoreStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  }
});
