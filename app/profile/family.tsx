import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, FileText, Trash2, Heart, Activity, AlertTriangle, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/useProfileStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import FamilyMemberForm from '@/components/profile/FamilyMemberForm';

export default function FamilyScreen() {
  const { colors, isDark } = useTheme();
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);
  const familyMembers = useProfileStore(state => state.familyMembers);
  const removeFamilyMember = useProfileStore(state => state.removeFamilyMember);

  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      removeFamilyMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Family Members</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage family profiles to easily view and organize their medical records and histories.
            </Text>
          </Animated.View>

          <View style={styles.list}>
            {familyMembers.map((member, index) => {
              const currentYear = new Date().getFullYear();
              const displayAge = member.age || (member.dob ? currentYear - parseInt(member.dob.split('-')[0], 10) : 35);
              return (
                <Animated.View key={member.id} entering={FadeInDown.delay(200 + index * 100)}>
                  <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                    <View style={styles.cardHeader}>
                      <Image source={{ uri: member.avatar || `https://i.pravatar.cc/150?u=${member.id}` }} style={styles.avatar} />
                      
                      <View style={styles.info}>
                        <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
                        <Text style={[styles.relation, { color: colors.textSecondary }]}>
                          {member.relation} • {displayAge} Yrs {member.gender ? `• ${member.gender}` : ''}
                        </Text>
                        {member.bloodGroup && (
                          <View style={styles.bloodTag}>
                            <Heart size={12} color="#EF4444" style={{ marginRight: 4 }} />
                            <Text style={styles.bloodTagText}>Blood: {member.bloodGroup}</Text>
                          </View>
                        )}
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.optionsButton}
                        onPress={() => setMemberToDelete({ id: member.id, name: member.name })}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    {member.medicalHistory && (
                      <View style={[styles.historyRow, { backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA' }]}>
                        <Activity size={14} color={colors.accent} style={{ marginRight: 6 }} />
                        <Text style={[styles.historyText, { color: colors.textSecondary }]}>
                          Condition: {member.medicalHistory}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0FDF4', borderColor: isDark ? '#333' : '#DCFCE7' }]}
                        onPress={() => router.push(`/profile/records?memberId=${member.id}` as any)}
                        activeOpacity={0.8}
                      >
                        <FileText size={16} color={colors.accent} />
                        <Text style={[styles.actionBtnText, { color: colors.accent }]}>View Health Records</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
          
          <Animated.View entering={FadeInDown.delay(500)}>
            <Pressable 
              style={[styles.addCard, { borderColor: colors.accent, borderStyle: 'dashed' }]}
              onPress={() => bottomSheetRef.current?.present()}
            >
              <View style={[styles.addIconWrap, { backgroundColor: colors.accent + '15' }]}>
                <Plus size={24} color={colors.accent} />
              </View>
              <Text style={[styles.addText, { color: colors.accent }]}>Add New Family Member</Text>
            </Pressable>
          </Animated.View>

        </ScrollView>
        
        <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
          <FamilyMemberForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
        </ActionBottomSheet>

        {/* Minimal Custom Delete Confirmation Modal */}
        <Modal
          visible={!!memberToDelete}
          transparent
          animationType="fade"
          onRequestClose={() => setMemberToDelete(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setMemberToDelete(null)}>
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

              <Text style={[styles.deleteModalTitle, { color: colors.text }]}>Remove Family Member?</Text>
              <Text style={[styles.deleteModalDesc, { color: colors.textSecondary }]}>
                Are you sure you want to remove <Text style={{ fontWeight: '700', color: colors.text }}>{memberToDelete?.name}</Text>? Associated health records will no longer be linked to this member profile.
              </Text>

              <View style={styles.deleteModalBtnRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { backgroundColor: isDark ? '#2D3748' : '#F1F5F9' }]}
                  onPress={() => setMemberToDelete(null)}
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
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    padding: 18,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  cardActions: {
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  relation: {
    fontSize: 13,
    marginBottom: 4,
  },
  bloodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  bloodTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 4,
  },
  historyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  optionsButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    height: 68,
  },
  addIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addText: {
    fontSize: 15,
    fontWeight: '700',
  },
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
