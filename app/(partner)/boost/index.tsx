import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../../components/partner/PartnerHeader';
import { BoostCampaignCard } from '../../../components/partner/BoostCampaignCard';
import { usePartnerStore } from '../../../hooks/usePartnerStore';
import { useTheme } from '../../../hooks/useTheme';

export default function PartnerBoostScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { boostTiers, activeBoostId } = usePartnerStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Boost & Promote Suite</Text>
          <Text style={styles.pageSub}>Maximize hospital visibility & patient conversions</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Explainer */}
        <View style={[styles.heroCard, { backgroundColor: 'rgba(236, 72, 153, 0.12)', borderColor: '#EC4899' }]}>
          <Ionicons name="rocket-sharp" size={32} color="#EC4899" />
          <View style={styles.heroTextGroup}>
            <Text style={styles.heroTitle}>Propel Your Hospital To Top 1% Searches</Text>
            <Text style={styles.heroSub}>
              Boosted partner profiles receive 4.8x more direct calls and emergency consultations in your city.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Promotion Plans</Text>

        {boostTiers.map((tier) => (
          <BoostCampaignCard key={tier.id} tier={tier} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pageSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EC4899',
  },
  heroSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 6,
  },
});
