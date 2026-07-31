import React, { useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, FileText, Download, Calendar, Package } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useRecordsStore } from '@/hooks/useRecordsStore';
import { exportPrescriptionPdf } from '@/services/prescriptionPdfService';

export default function PrescriptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  const prescriptions = useRecordsStore((state) => state.prescriptions);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExport = async (script: (typeof prescriptions)[number]) => {
    setExportingId(script.id);
    try {
      await exportPrescriptionPdf(script);
    } catch (error) {
      Alert.alert('Could not create PDF', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Prescriptions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {prescriptions.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.iconCircle}>
              <FileText size={32} color="#10B981" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Prescriptions</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Your digital prescriptions will be securely stored here after consultations.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {prescriptions.map((script) => (
              <View 
                key={script.id} 
                style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.doctorName, { color: colors.text }]}>{script.doctorName}</Text>
                    <Text style={[styles.specialty, { color: colors.accent }]}>{script.specialty}</Text>
                  </View>
                  <View style={[styles.iconWrap, { backgroundColor: colors.accent + '15' }]}>
                    <FileText size={20} color={colors.accent} />
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>Issued: {script.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>Valid till: {script.validUntil}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Package size={16} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{script.medicinesCount} Medicines prescribed</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.downloadBtn, { backgroundColor: colors.accent + '10' }]}
                  onPress={() => handleExport(script)}
                  disabled={exportingId === script.id}
                  accessibilityLabel={`Download PDF for ${script.doctorName}`}
                >
                  {exportingId === script.id ? <ActivityIndicator size="small" color={colors.accent} /> : <Download size={18} color={colors.accent} />}
                  <Text style={[styles.downloadText, { color: colors.accent }]}>{exportingId === script.id ? 'Creating PDF…' : 'Download PDF'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 16 },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  specialty: { fontSize: 14, fontWeight: '600' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
  }
});
