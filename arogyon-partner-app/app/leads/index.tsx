import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../components/PartnerHeader';
import { LeadRequestCard } from '../../components/LeadRequestCard';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export default function PartnerLeadsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { leads } = usePartnerStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Patient Enquiries & Leads</Text>
          <Text style={styles.pageSub}>Manage direct consultation requests and intake status</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryBar}>
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' }]}>
            <Text style={[styles.summaryVal, { color: '#3B82F6' }]}>
              {leads.filter((l) => l.status === 'New').length}
            </Text>
            <Text style={styles.summaryLbl}>New Intake</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
            <Text style={[styles.summaryVal, { color: '#F59E0B' }]}>
              {leads.filter((l) => l.status === 'Contacted').length}
            </Text>
            <Text style={styles.summaryLbl}>In Follow-up</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}>
            <Text style={[styles.summaryVal, { color: '#10B981' }]}>
              {leads.filter((l) => l.status === 'Scheduled').length}
            </Text>
            <Text style={styles.summaryLbl}>Confirmed</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Patient Request Leads ({leads.length})</Text>

        {leads.map((lead) => (
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
  scrollContent: {
    paddingBottom: 40,
  },
  summaryBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryLbl: {
    fontSize: 11,
    color: '#64748B',
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
