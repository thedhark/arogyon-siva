import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileText, Plus, Search, File, Folder, Users, Filter } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecordsStore, MedicalRecord } from '@/hooks/useRecordsStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import RecordItemCard from '@/components/records/RecordItemCard';
import DocumentReaderModal from '@/components/records/DocumentReaderModal';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Folder, color: '#10B981' },
  { id: 'lab', name: 'Lab Reports', icon: File, color: '#10B981' },
  { id: 'prescription', name: 'Prescriptions', icon: FileText, color: '#3B82F6' },
  { id: 'invoice', name: 'Invoices', icon: Folder, color: '#F59E0B' },
];

export default function ProfileRecordsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ memberId?: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const userProfile = useProfileStore(state => state.userProfile);
  const familyMembers = useProfileStore(state => state.familyMembers);
  const records = useRecordsStore(state => state.records);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(params.memberId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalRecord, setActiveModalRecord] = useState<MedicalRecord | null>(null);

  // Filter Records
  const filteredRecords = records.filter(r => {
    // Search Filter
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      r.title.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) ||
      (r.summary && r.summary.toLowerCase().includes(q)) ||
      (r.extractedText && r.extractedText.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );

    // Category Filter
    const matchesCategory = selectedCategory === 'all' || r.category.toLowerCase().includes(selectedCategory);

    // Family Member Filter
    const matchesMember = selectedMemberId === 'all' || r.patientName?.toLowerCase().includes(
      selectedMemberId === 'self' 
        ? userProfile.name.toLowerCase() 
        : (familyMembers.find(m => m.id === selectedMemberId)?.name.toLowerCase() || '')
    );

    return matchesSearch && matchesCategory && matchesMember;
  });

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
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100)} style={[
          styles.searchBar, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
        ]}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search reports, medicines, doctor remarks..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        {/* Family Member Selector Pills */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient / Family Member</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberScroll}>
          <TouchableOpacity
            style={[
              styles.memberChip,
              { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
              selectedMemberId === 'all' && { backgroundColor: colors.accent }
            ]}
            onPress={() => setSelectedMemberId('all')}
          >
            <Users size={16} color={selectedMemberId === 'all' ? '#FFF' : colors.textMuted} />
            <Text style={[styles.chipText, { color: selectedMemberId === 'all' ? '#FFF' : colors.text }]}>All Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.memberChip,
              { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
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
                { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
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

        {/* Category Pills */}
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catBadge,
                { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
                selectedCategory === cat.id && { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderWidth: 1 }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.catBadgeText, { color: selectedCategory === cat.id ? colors.accent : colors.textSecondary }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Medical Records List */}
        <View style={styles.filesList}>
          {filteredRecords.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <FileText size={36} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No medical records match your selected filters.
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
            filteredRecords.map((file, index) => (
              <Animated.View key={file.id} entering={FadeInDown.delay(index * 60)}>
                <RecordItemCard
                  file={file}
                  onPress={() => setActiveModalRecord(file)}
                />
              </Animated.View>
            ))
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
  headerTitle: { fontSize: 22, fontWeight: '700', flex: 1 },
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
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  memberScroll: { gap: 10, marginBottom: 20 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  categoriesRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  catBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  catBadgeText: { fontSize: 13, fontWeight: '600' },
  filesList: { gap: 12 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 20, gap: 12, marginTop: 10 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  uploadPromptBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  uploadPromptText: { color: '#FFF', fontSize: 14, fontWeight: '700' }
});

