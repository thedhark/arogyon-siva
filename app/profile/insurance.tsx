import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert, Plus, ShieldCheck } from 'lucide-react-native';
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
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Insurance</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {insurances.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.iconCircle}>
              <ShieldAlert size={32} color="#10B981" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Insurance Linked</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Link your health insurance policies to pay directly with coverage.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {insurances.map(ins => (
              <View key={ins.id} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.providerName, { color: colors.text }]}>{ins.provider}</Text>
                  {ins.verified && (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={14} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.policyNumber, { color: colors.textSecondary }]}>Policy: {ins.policyNumber}</Text>
                <Text style={[styles.expiry, { color: colors.textSecondary }]}>Valid till: {ins.expiry}</Text>
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
          <Text style={[styles.addText, { color: colors.accent }]}>Add New Insurance</Text>
        </Pressable>

      </ScrollView>

      <ActionBottomSheet ref={bottomSheetRef}>
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
  content: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 20, marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 16, marginBottom: 20, marginTop: 10 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  providerName: { fontSize: 18, fontWeight: '700' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  verifiedText: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  policyNumber: { fontSize: 15, marginBottom: 4 },
  expiry: { fontSize: 14 },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 2, height: 80 },
  addIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addText: { fontSize: 16, fontWeight: '600' }
});
