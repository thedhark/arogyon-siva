import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../../components/partner/PartnerHeader';
import { PackageManagementCard } from '../../../components/partner/PackageManagementCard';
import { usePartnerStore } from '../../../hooks/usePartnerStore';
import { useTheme } from '../../../hooks/useTheme';

export default function PartnerListingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { packages } = usePartnerStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Packages & Services Manager</Text>
          <Text style={styles.pageSub}>Manage diagnostic deals, package pricing & spotlighting</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryBar}>
          <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryNum, { color: colors.text }]}>{packages.length}</Text>
            <Text style={styles.summaryLabel}>Total Packages</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryNum, { color: '#10B981' }]}>
              {packages.filter((p) => p.active).length}
            </Text>
            <Text style={styles.summaryLabel}>Active Deals</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryNum, { color: '#F59E0B' }]}>
              {packages.filter((p) => p.promoted).length}
            </Text>
            <Text style={styles.summaryLabel}>Featured Spots</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hospital Health Packages</Text>

        {packages.map((pkg) => (
          <PackageManagementCard key={pkg.id} item={pkg} />
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
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 6,
  },
});
