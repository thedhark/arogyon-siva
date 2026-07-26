import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert, Plus, ShieldCheck, Trash2, ExternalLink, Award, FileText } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useProfileStore } from '@/hooks/useProfileStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import InsuranceForm from '@/components/profile/InsuranceForm';

export default function InsuranceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  const insurances = useProfileStore(state => state.insurances);
  const removeInsurance = useProfileStore(state => state.removeInsurance);
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  const handleDelete = (id: string, provider: string) => {
    Alert.alert(
      'Remove Policy',
      `Are you sure you want to remove ${provider}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeInsurance(id) },
      ]
    );
  };

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Insurance</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {insurances.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.iconCircle}>
              <ShieldAlert size={36} color="#10B981" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Insurance Linked</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Link your health insurance policy to claim cashless treatments & fast approval at 5000+ network hospitals.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {insurances.map(ins => (
              <View key={ins.id} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.providerName, { color: colors.text }]}>{ins.provider}</Text>
                    <Text style={[styles.policyHolder, { color: colors.textSecondary }]}>
                      Holder: {ins.policyHolder || 'Ananya Sharma'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {ins.verified && (
                      <View style={styles.verifiedBadge}>
                        <ShieldCheck size={14} color="#10B981" />
                        <Text style={styles.verifiedText}>Cashless</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => handleDelete(ins.id, ins.provider)} style={{ padding: 4 }}>
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardDetailsRow}>
                  <View style={styles.detailCol}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>POLICY NO</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ins.policyNumber}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>SUM INSURED</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]}>{ins.coverageAmount || '₹10,000,000'}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>VALID TILL</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ins.expiry}</Text>
                  </View>
                </View>

                {ins.tpaId && (
                  <View style={styles.tpaRow}>
                    <Award size={14} color={colors.textSecondary} />
                    <Text style={[styles.tpaText, { color: colors.textSecondary }]}>TPA Card Ref ID: {ins.tpaId}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <Pressable 
          style={[styles.addCard, { borderColor: colors.accent, borderStyle: 'dashed' }]}
          onPress={() => bottomSheetRef.current?.present()}
        >
          <View style={[styles.addIconWrap, { backgroundColor: colors.accent + '15' }]}>
            <Plus size={24} color={colors.accent} />
          </View>
          <Text style={[styles.addText, { color: colors.accent }]}>Add New Insurance Policy</Text>
        </Pressable>

        <View style={[styles.infoBanner, { backgroundColor: isDark ? '#1E1E1E' : '#ECFDF5' }]}>
          <FileText size={20} color="#10B981" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: colors.text }]}>Cashless Claim Assistance</Text>
            <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
              Present your Arogyon Insurance ID at any network hospital reception for 1-click authorization.
            </Text>
          </View>
        </View>

      </ScrollView>

      <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
        <InsuranceForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
      </ActionBottomSheet>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 60 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 20, marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 16, marginBottom: 20, marginTop: 10 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  providerName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  policyHolder: { fontSize: 13 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  verifiedText: { fontSize: 12, color: '#10B981', fontWeight: '700' },
  cardDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 12 },
  detailCol: { gap: 4 },
  detailLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '700' },
  tpaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
  tpaText: { fontSize: 12, fontWeight: '500' },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 20, borderWidth: 2, height: 72 },
  addIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addText: { fontSize: 16, fontWeight: '700' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginTop: 24 },
  bannerTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  bannerSubtitle: { fontSize: 12, lineHeight: 18 },
});

