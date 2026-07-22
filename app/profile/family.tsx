import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, MoreHorizontal, CalendarPlus, FileText } from 'lucide-react-native';
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
  const addFamilyMember = useProfileStore(state => state.addFamilyMember);

  // Pre-seed some dummy data if empty just for demo
  useEffect(() => {
    if (familyMembers.length === 0) {
      addFamilyMember({ name: 'Ravi Sharma', relation: 'Father', dob: '1965-01-01', gender: 'Male' });
    }
  }, []);

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Family Members</Text>
          <Pressable style={styles.addButton} onPress={() => bottomSheetRef.current?.present()}>
            <Plus size={24} color={colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage family profiles to easily book appointments and lab tests for them.
            </Text>
          </Animated.View>

          <View style={styles.list}>
            {familyMembers.map((member, index) => {
              const age = 2024 - parseInt(member.dob.split('-')[0]);
              return (
                <Animated.View key={member.id} entering={FadeInDown.delay(200 + index * 100)}>
                  <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                    <View style={styles.cardHeader}>
                      <Image source={{ uri: `https://i.pravatar.cc/150?u=${member.id}` }} style={styles.avatar} />
                      
                      <View style={styles.info}>
                        <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
                        <Text style={[styles.relation, { color: colors.textSecondary }]}>
                          {member.relation} • {age} yrs
                        </Text>
                      </View>
                      
                      <Pressable style={styles.optionsButton}>
                        <MoreHorizontal size={24} color={colors.textSecondary} />
                      </Pressable>
                    </View>
                    
                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                        onPress={() => router.push('/records')}
                      >
                        <FileText size={16} color={colors.text} />
                        <Text style={[styles.actionBtnText, { color: colors.text }]}>Records</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.primaryActionBtn, { backgroundColor: colors.accent }]}
                        onPress={() => router.push('/category/doctor')}
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
              <Text style={[styles.addText, { color: colors.accent }]}>Add New Member</Text>
            </Pressable>
          </Animated.View>

        </ScrollView>
        
        <ActionBottomSheet ref={bottomSheetRef}>
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
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
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
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  primaryActionBtn: {
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  relation: {
    fontSize: 14,
  },
  optionsButton: {
    padding: 8,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    height: 80,
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
    fontWeight: '600',
  }
});
