import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../../components/partner/PartnerHeader';
import { LeadRequestCard } from '../../../components/partner/LeadRequestCard';
import { usePartnerStore } from '../../../hooks/usePartnerStore';
import { useTheme } from '../../../hooks/useTheme';

export default function PartnerLeadsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { leads } = usePartnerStore();
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Scheduled'>('All');

  const filteredLeads = leads.filter((l) => (filter === 'All' ? true : l.status === filter));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Patient Enquiries & Leads</Text>
          <Text style={styles.pageSub}>Real-time incoming appointment & consultation requests</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['All', 'New', 'Contacted', 'Scheduled'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterTab,
              filter === f
                ? { backgroundColor: '#3B82F6' }
                : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.filterText, filter === f ? { color: '#FFFFFF' } : { color: colors.text }]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredLeads.map((lead) => (
          <LeadRequestCard key={lead.id} lead={lead} />
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
