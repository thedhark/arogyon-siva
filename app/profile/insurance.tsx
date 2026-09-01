import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, Platform, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert, Plus, ShieldCheck, Trash2, Award, FileText, Copy, Check, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { ZoomIn } from 'react-native-reanimated';
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

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [policyToDelete, setPolicyToDelete] = useState<{ id: string; provider: string } | null>(null);

  const handleCopyPolicy = async (policyNo: string, id: string) => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(policyNo);
      } else {
        // Try dynamic expo-clipboard if available, otherwise share
        try {
          const ExpoClipboard = require('expo-clipboard');
          if (ExpoClipboard?.setStringAsync) {
            await ExpoClipboard.setStringAsync(policyNo);
          }
        } catch {
          await Share.share({ message: policyNo });
        }
      }
    } catch {
      // Graceful fallback
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = () => {
    if (policyToDelete) {
      removeInsurance(policyToDelete.id);
      setPolicyToDelete(null);
    }
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
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.providerName, { color: colors.text }]}>{ins.provider}</Text>
                    <Text style={[styles.policyHolder, { color: colors.textSecondary }]}>
                      Holder: {ins.policyHolder || 'Ananya Sharma'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {ins.verified && (
                      <View style={styles.verifiedBadge}>
                        <ShieldCheck size={13} color="#10B981" />
                        <Text style={styles.verifiedText}>Cashless</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      onPress={() => setPolicyToDelete({ id: ins.id, provider: ins.provider })} 
                      style={styles.deleteIconBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Policy Number Box */}
                <View style={[styles.policyNumContainer, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>POLICY / CARD NUMBER</Text>
                    <Text style={[styles.policyNumberText, { color: colors.text }]} selectable>
                      {ins.policyNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.copyBtn, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}
                    onPress={() => handleCopyPolicy(ins.policyNumber, ins.id)}
                    activeOpacity={0.7}
                  >
                    {copiedId === ins.id ? (
                      <Check size={14} color="#10B981" />
                    ) : (
                      <Copy size={14} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailTile}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>SUM INSURED</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]}>{ins.coverageAmount || '₹10,00,000'}</Text>
                  </View>

                  <View style={styles.detailTile}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>VALID TILL</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ins.expiry}</Text>
                  </View>
                </View>

                {ins.tpaId && (
                  <View style={[styles.tpaRow, { borderTopColor: isDark ? '#333' : '#F1F5F9' }]}>
                    <Award size={14} color={colors.textSecondary} />
                    <Text style={[styles.tpaText, { color: colors.textSecondary }]}>TPA Member Ref: {ins.tpaId}</Text>
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
            <Plus size={22} color={colors.accent} />
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

      {/* Minimal Delete Confirmation Modal */}
      <Modal
        visible={!!policyToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setPolicyToDelete(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPolicyToDelete(null)}>
          <Animated.View 
            entering={ZoomIn.duration(200)}
            style={[
              styles.deleteModalCard, 
              { backgroundColor: isDark ? '#1F2430' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }
            ]}
          >
            <View style={styles.deleteIconWrap}>
              <AlertTriangle size={28} color="#EF4444" />
            </View>

            <Text style={[styles.deleteModalTitle, { color: colors.text }]}>Remove Insurance Policy?</Text>
            <Text style={[styles.deleteModalDesc, { color: colors.textSecondary }]}>
              Are you sure you want to remove <Text style={{ fontWeight: '700', color: colors.text }}>{policyToDelete?.provider}</Text>? Cashless checkout for this policy will be disabled.
            </Text>

            <View style={styles.deleteModalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { backgroundColor: isDark ? '#2D3748' : '#F1F5F9' }]}
                onPress={() => setPolicyToDelete(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmDeleteBtn}
                onPress={handleConfirmDelete}
                activeOpacity={0.85}
              >
                <Trash2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalConfirmDeleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  content: { padding: 20, paddingBottom: 60 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 20, marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 14, marginBottom: 18, marginTop: 4 },
  card: { padding: 18, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  providerName: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  policyHolder: { fontSize: 12.5 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  verifiedText: { fontSize: 11.5, color: '#10B981', fontWeight: '700' },
  deleteIconBtn: { padding: 6, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.08)' },
  policyNumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  policyNumberText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  copyBtn: {
    padding: 6,
    borderRadius: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailTile: {
    flex: 1,
    gap: 2,
  },
  detailLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '800' },
  tpaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6, borderTopWidth: 1, paddingTop: 10 },
  tpaText: { fontSize: 12, fontWeight: '500' },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 20, borderWidth: 2, height: 68 },
  addIconWrap: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addText: { fontSize: 15, fontWeight: '700' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginTop: 20 },
  bannerTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  bannerSubtitle: { fontSize: 12, lineHeight: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deleteModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  deleteIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteModalDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 22,
  },
  deleteModalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  modalConfirmDeleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});


