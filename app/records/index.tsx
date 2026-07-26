import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FileText, Plus, Search, Folder, File, Users, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecordsStore, MedicalRecord } from '@/hooks/useRecordsStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import RecordItemCard from '@/components/records/RecordItemCard';
import DocumentReaderModal from '@/components/records/DocumentReaderModal';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import FamilyMemberForm from '@/components/profile/FamilyMemberForm';

const CATEGORIES = [
  { id: '1', name: 'Prescriptions', icon: FileText, color: '#3B82F6' },
  { id: '2', name: 'Lab Reports', icon: File, color: '#10B981' },
  { id: '3', name: 'Invoices', icon: Folder, color: '#F59E0B' },
];

export default function RecordsScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{ memberId?: string }>();
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const records = useRecordsStore((state) => state.records);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(params.memberId || 'all');
  const [activeModalRecord, setActiveModalRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = records.filter(r => {
    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      r.title.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) ||
      (r.summary && r.summary.toLowerCase().includes(q)) ||
      (r.extractedText && r.extractedText.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );

    // Patient family member match
    const selectedMember = familyMembers.find(m => m.id === selectedMemberId);
    const targetName = selectedMemberId === 'self'
      ? userProfile.name.toLowerCase()
      : (selectedMember ? selectedMember.name.toLowerCase() : '');

    const matchesMember = selectedMemberId === 'all' || !targetName || (r.patientName && r.patientName.toLowerCase().includes(targetName));

    return matchesSearch && matchesMember;
  });

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Medical Records</Text>
          <Pressable 
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/records/upload')}
          >
            <Plus size={20} color="#FFF" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(100)} style={[
            styles.searchBar, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
          ]}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search reports, medicines, lab metrics..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Animated.View>

          {/* Family Member / Patient Filter Chips */}
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Patient / Family</Text>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                onPress={() => bottomSheetRef.current?.present()}
              >
                <UserPlus size={14} color={colors.accent} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>+ Add Family</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberScroll}>
              <TouchableOpacity
                style={[
                  styles.memberChip,
                  { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#333' : '#E5E7EB' },
                  selectedMemberId === 'all' && { backgroundColor: colors.accent, borderColor: colors.accent }
                ]}
                onPress={() => setSelectedMemberId('all')}
              >
                <Users size={15} color={selectedMemberId === 'all' ? '#FFF' : colors.textMuted} />
                <Text style={[styles.chipText, { color: selectedMemberId === 'all' ? '#FFF' : colors.text }]}>All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.memberChip,
                  { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#333' : '#E5E7EB' },
                  selectedMemberId === 'self' && { backgroundColor: colors.accent, borderColor: colors.accent }
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
                    { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#333' : '#E5E7EB' },
                    selectedMemberId === m.id && { backgroundColor: colors.accent, borderColor: colors.accent }
                  ]}
                  onPress={() => setSelectedMemberId(m.id)}
                >
                  <Text style={[styles.chipText, { color: selectedMemberId === m.id ? '#FFF' : colors.text }]}>
                    {m.name} ({m.relation})
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.memberChip,
                  { backgroundColor: colors.accent + '15', borderColor: colors.accent, borderStyle: 'dashed' }
                ]}
                onPress={() => bottomSheetRef.current?.present()}
              >
                <Plus size={15} color={colors.accent} />
                <Text style={[styles.chipText, { color: colors.accent }]}>New Member</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Categories */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const count = records.filter(r => r.category.includes(cat.name.replace(/s$/, ''))).length;
              return (
                <Animated.View key={cat.id} entering={FadeInDown.delay(200 + index * 100)} style={styles.categoryWrapper}>
                  <Pressable style={[
                    styles.categoryCard, 
                    { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
                  ]}>
                    <View style={[styles.iconContainer, { backgroundColor: cat.color + '15' }]}>
                      <Icon size={24} color={cat.color} />
                    </View>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                    <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{count} files</Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Recent Files */}
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
              {searchQuery ? 'Search Results' : 'Recent Files'}
            </Text>
            {!searchQuery && (
              <Pressable>
                <Text style={[styles.seeAll, { color: colors.accent }]}>See All</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.filesList}>
            {filteredRecords.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>
                No matching medical records found.
              </Text>
            ) : (
              filteredRecords.map((file, index) => (
                <Animated.View key={file.id} entering={FadeInDown.delay(400 + index * 50)}>
                  <RecordItemCard
                    file={file}
                    onPress={() => setActiveModalRecord(file)}
                  />
                </Animated.View>
              ))
            )}
          </View>

        </ScrollView>

        {/* OCR Reader Document Details Modal Component */}
        <DocumentReaderModal
          record={activeModalRecord}
          visible={!!activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
        />

        {/* Add Family Member Sheet */}
        <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
          <FamilyMemberForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
        </ActionBottomSheet>

      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  memberScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  filesList: {
    gap: 12,
  },
});
