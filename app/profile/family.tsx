import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, CalendarPlus, FileText, Trash2, Heart, Phone, Activity } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/useProfileStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import FamilyMemberForm from '@/components/profile/FamilyMemberForm';

export default function FamilyScreen() {
  const { colors, isDark } = useTheme();
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);
  const familyMembers = useProfileStore(state => state.familyMembers);
  const removeFamilyMember = useProfileStore(state => state.removeFamilyMember);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remove Family Member',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFamilyMember(id) },
      ]
    );
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
              Manage family profiles to easily upload medical records and book appointments for them.
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
                        onPress={() => handleDelete(member.id, member.name)}
                      >
                        <Trash2 size={20} color="#EF4444" />
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
                        style={[styles.actionBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                        onPress={() => router.push(`/records?memberId=${member.id}` as any)}
                      >
                        <FileText size={16} color={colors.text} />
                        <Text style={[styles.actionBtnText, { color: colors.text }]}>Health Records</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.primaryActionBtn, { backgroundColor: colors.accent }]}
                        onPress={() => router.push(`/category/doctor?patientId=${member.id}` as any)}
                      >
                        <CalendarPlus size={16} color="#FFFFFF" />
                        <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Book Appointment</Text>
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
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
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
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  primaryActionBtn: {
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
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
    padding: 6,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    height: 72,
  },
  addIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
