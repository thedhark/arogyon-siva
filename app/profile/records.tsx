import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileText, Plus, Search, File, Folder, Users, Download, Calendar, Package, Receipt, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecordsStore, MedicalRecord, Prescription, Order } from '@/hooks/useRecordsStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import RecordItemCard from '@/components/records/RecordItemCard';
import DocumentReaderModal from '@/components/records/DocumentReaderModal';
import { exportPrescriptionPdf } from '@/services/prescriptionPdfService';

const CATEGORIES = [
  { id: 'all', name: 'All Records', icon: Folder },
  { id: 'lab', name: 'Lab Reports', icon: File },
  { id: 'prescription', name: 'Prescriptions', icon: FileText },
  { id: 'invoice', name: 'Invoices & Bills', icon: Receipt },
];

export default function ProfileRecordsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ memberId?: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const userProfile = useProfileStore(state => state.userProfile);
  const familyMembers = useProfileStore(state => state.familyMembers);
  const records = useRecordsStore(state => state.records);
  const prescriptions = useRecordsStore(state => state.prescriptions);
  const orders = useRecordsStore(state => state.orders);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(params.memberId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalRecord, setActiveModalRecord] = useState<MedicalRecord | null>(null);
  const [exportingScriptId, setExportingScriptId] = useState<string | null>(null);

  const handleExportPrescription = async (script: Prescription) => {
    setExportingScriptId(script.id);
    try {
      await exportPrescriptionPdf(script);
    } catch (error) {
      Alert.alert('Could not create PDF', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setExportingScriptId(null);
    }
  };

  const q = searchQuery.toLowerCase();

  // Filter Uploaded Records
  const filteredRecords = records.filter(r => {
    const matchesSearch = !q || (
      r.title.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) ||
      (r.summary && r.summary.toLowerCase().includes(q)) ||
      (r.extractedText && r.extractedText.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );

    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'lab' && r.category.toLowerCase().includes('lab')) ||
      (selectedCategory === 'prescription' && r.category.toLowerCase().includes('prescription')) ||
      (selectedCategory === 'invoice' && (r.category.toLowerCase().includes('invoice') || r.category.toLowerCase().includes('bill')));

    const matchesMember = selectedMemberId === 'all' || r.patientName?.toLowerCase().includes(
      selectedMemberId === 'self' 
        ? userProfile.name.toLowerCase() 
        : (familyMembers.find(m => m.id === selectedMemberId)?.name.toLowerCase() || '')
    );

    return matchesSearch && matchesCategory && matchesMember;
  });

  // Filter Digital Prescriptions
  const filteredPrescriptions = (selectedCategory === 'all' || selectedCategory === 'prescription')
    ? prescriptions.filter(p => {
        const matchesSearch = !q || p.doctorName.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q);
        const matchesMember = selectedMemberId === 'all' || selectedMemberId === 'self';
        return matchesSearch && matchesMember;
      })
    : [];

  // Filter Invoices / Consultation Orders
  const filteredOrders = (selectedCategory === 'all' || selectedCategory === 'invoice')
    ? orders.filter(o => {
        const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.items.some(i => i.toLowerCase().includes(q));
        const matchesMember = selectedMemberId === 'all' || selectedMemberId === 'self';
        return matchesSearch && matchesMember;
      })
    : [];

  const totalItemsCount = filteredRecords.length + filteredPrescriptions.length + filteredOrders.length;

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Records</Text>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/records/upload')}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100)} style={[
          styles.searchBar, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E2E8F0' }
        ]}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search lab reports, prescriptions, medicines..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        {/* Patient / Family Member Selector */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Profile</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberScroll}>
          <TouchableOpacity
            style={[
              styles.memberChip,
              { backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9' },
              selectedMemberId === 'all' && { backgroundColor: colors.accent }
            ]}
            onPress={() => setSelectedMemberId('all')}
          >
            <Users size={15} color={selectedMemberId === 'all' ? '#FFF' : colors.textMuted} />
            <Text style={[styles.chipText, { color: selectedMemberId === 'all' ? '#FFF' : colors.text }]}>All Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.memberChip,
              { backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9' },
              selectedMemberId === 'self' && { backgroundColor: colors.accent }
            ]}
            onPress={() => setSelectedMemberId('self')}
          >
            <Text style={[styles.chipText, { color: selectedMemberId === 'self' ? '#FFF' : colors.text }]}>Self ({userProfile.name.split(' ')[0]})</Text>
          </TouchableOpacity>

          {familyMembers.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.memberChip,
                { backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9' },
                selectedMemberId === m.id && { backgroundColor: colors.accent }
              ]}
              onPress={() => setSelectedMemberId(m.id)}
            >
              <Text style={[styles.chipText, { color: selectedMemberId === m.id ? '#FFF' : colors.text }]}>
                {m.name} ({m.relation})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filter Pills */}
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catBadge,
                { backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9' },
                selectedCategory === cat.id && { backgroundColor: colors.accent + '1A', borderColor: colors.accent, borderWidth: 1.5 }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.catBadgeText, { color: selectedCategory === cat.id ? colors.accent : colors.textSecondary }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Unified Records Content */}
        <View style={styles.filesList}>
          {totalItemsCount === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <FileText size={40} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Health Records Found</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Upload your lab tests, diagnostic scans, and prescriptions to access them anytime.
              </Text>
              <TouchableOpacity 
                style={[styles.uploadPromptBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/records/upload')}
              >
                <Plus size={16} color="#FFF" />
                <Text style={styles.uploadPromptText}>Upload Health Record</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* 1. Uploaded Medical Records (Lab reports, Scans, etc.) */}
              {filteredRecords.map((file, index) => (
                <Animated.View key={file.id} entering={FadeInDown.delay(index * 40)}>
                  <RecordItemCard
                    file={file}
                    onPress={() => setActiveModalRecord(file)}
                  />
                </Animated.View>
              ))}

              {/* 2. Digital Prescriptions */}
              {filteredPrescriptions.map((script, index) => (
                <Animated.View key={script.id} entering={FadeInDown.delay(index * 40)}>
                  <View style={[styles.scriptCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E2E8F0' }]}>
                    <View style={styles.scriptHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.scriptDoctor, { color: colors.text }]}>{script.doctorName}</Text>
                        <Text style={[styles.scriptSpecialty, { color: colors.accent }]}>{script.specialty}</Text>
                      </View>
                      <View style={[styles.scriptIconWrap, { backgroundColor: colors.accent + '15' }]}>
                        <FileText size={20} color={colors.accent} />
                      </View>
                    </View>

                    <View style={styles.scriptBody}>
                      <View style={styles.scriptRow}>
                        <Calendar size={14} color={colors.textMuted} />
                        <Text style={[styles.scriptInfoText, { color: colors.textSecondary }]}>Issued: {script.date} • Valid till: {script.validUntil}</Text>
                      </View>
                      <View style={styles.scriptRow}>
                        <Package size={14} color={colors.textMuted} />
                        <Text style={[styles.scriptInfoText, { color: colors.textSecondary }]}>{script.medicinesCount} Medicines Prescribed</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.downloadBtn, { backgroundColor: colors.accent + '15' }]}
                      onPress={() => handleExportPrescription(script)}
                      disabled={exportingScriptId === script.id}
                      activeOpacity={0.8}
                    >
                      {exportingScriptId === script.id ? (
                        <ActivityIndicator size="small" color={colors.accent} />
                      ) : (
                        <Download size={16} color={colors.accent} />
                      )}
                      <Text style={[styles.downloadBtnText, { color: colors.accent }]}>
                        {exportingScriptId === script.id ? 'Generating PDF…' : 'Download Digital Prescription'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}

              {/* 3. Invoices & Pharmacy Orders */}
              {filteredOrders.map((order, index) => (
                <Animated.View key={order.id} entering={FadeInDown.delay(index * 40)}>
                  <View style={[styles.invoiceCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E2E8F0' }]}>
                    <View style={styles.invoiceHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.invoiceId, { color: colors.text }]}>Invoice #{order.id}</Text>
                        <Text style={[styles.invoiceDate, { color: colors.textMuted }]}>{order.date}</Text>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)' }]}>
                        <Text style={[styles.statusPillText, { color: order.status === 'Delivered' ? '#10B981' : '#3B82F6' }]}>{order.status}</Text>
                      </View>
                    </View>

                    <View style={styles.invoiceItems}>
                      {order.items.map((item, idx) => (
                        <Text key={idx} style={[styles.invoiceItemText, { color: colors.textSecondary }]}>• {item}</Text>
                      ))}
                    </View>

                    <View style={styles.invoiceFooter}>
                      <Text style={[styles.invoiceTotalLabel, { color: colors.textMuted }]}>Total Paid</Text>
                      <Text style={[styles.invoiceTotalVal, { color: colors.text }]}>{order.total}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </>
          )}
        </View>

      </ScrollView>

      {/* OCR Reader Document Modal */}
      <DocumentReaderModal
        record={activeModalRecord}
        visible={!!activeModalRecord}
        onClose={() => setActiveModalRecord(null)}
      />

    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', flex: 1, letterSpacing: -0.4 },
  addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 80 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, letterSpacing: -0.2 },
  memberScroll: { gap: 8, marginBottom: 18 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    gap: 6,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  categoriesRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  catBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  catBadgeText: { fontSize: 13, fontWeight: '700' },
  filesList: { gap: 14 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, gap: 10, marginTop: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptyText: { fontSize: 13.5, textAlign: 'center', lineHeight: 20 },
  uploadPromptBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 20, gap: 6, marginTop: 6 },
  uploadPromptText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  scriptCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  scriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scriptDoctor: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  scriptSpecialty: {
    fontSize: 13,
    fontWeight: '600',
  },
  scriptIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scriptBody: {
    gap: 6,
    marginBottom: 14,
  },
  scriptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scriptInfoText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  invoiceCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceId: {
    fontSize: 15,
    fontWeight: '700',
  },
  invoiceDate: {
    fontSize: 12,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  invoiceItems: {
    gap: 4,
    marginBottom: 12,
    paddingLeft: 4,
  },
  invoiceItemText: {
    fontSize: 13,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  invoiceTotalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceTotalVal: {
    fontSize: 16,
    fontWeight: '800',
  },
});

