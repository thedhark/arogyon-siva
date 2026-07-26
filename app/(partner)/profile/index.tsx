import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../../components/partner/PartnerHeader';
import { usePartnerStore } from '../../../hooks/usePartnerStore';
import { useTheme } from '../../../hooks/useTheme';

export default function PartnerProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile, togglePartnerMode } = usePartnerStore();

  const handleSwitchBack = () => {
    togglePartnerMode(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover & Hospital Card */}
        <View style={styles.heroSection}>
          <Image source={{ uri: profile.coverImage }} style={styles.coverImage} />
          <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: profile.logo }} style={styles.avatar} />
            <Text style={[styles.hospitalName, { color: colors.text }]}>{profile.name}</Text>
            <Text style={styles.category}>{profile.category}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{profile.rating}</Text>
              <Text style={styles.reviewCount}>({profile.reviewsCount} Patient Reviews)</Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badgeItem}>
                <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                <Text style={styles.badgeText}>NABH Accredited</Text>
              </View>
              <View style={styles.badgeItem}>
                <Ionicons name="time" size={12} color="#3B82F6" />
                <Text style={styles.badgeText}>{profile.openStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact & Location */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Hospital Contact Details</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#3B82F6" />
            <Text style={[styles.infoVal, { color: colors.text }]}>{profile.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#10B981" />
            <Text style={[styles.infoVal, { color: colors.text }]}>{profile.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#8B5CF6" />
            <Text style={[styles.infoVal, { color: colors.text }]}>{profile.email}</Text>
          </View>
        </View>

        {/* Mode Switcher Action */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Partner Preferences</Text>

          <Pressable
            onPress={handleSwitchBack}
            style={({ pressed }) => [styles.switchRoleBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" />
            <Text style={styles.switchRoleText}>Switch to Patient App</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#1E293B',
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginTop: -34,
    backgroundColor: '#0F172A',
  },
  hospitalName: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  category: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
  },
  reviewCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 4,
  },
  switchRoleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
