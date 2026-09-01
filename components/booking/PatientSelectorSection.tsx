import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Plus, Check, User, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useProfileStore } from '@/hooks/useProfileStore';
import AddFamilyMemberModal, { NewFamilyMemberPayload } from '@/components/booking/AddFamilyMemberModal';

export interface SelectedPatientInfo {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  gender?: string;
  age?: number;
}

interface PatientSelectorSectionProps {
  selectedMemberId: string;
  onSelectMember: (member: SelectedPatientInfo) => void;
  isDark: boolean;
  colors?: any;
}

export default function PatientSelectorSection({
  selectedMemberId,
  onSelectMember,
  isDark,
}: PatientSelectorSectionProps) {
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Ignore
    }
  };

  const selfMember: SelectedPatientInfo = {
    id: 'me',
    name: userProfile?.name || 'Myself',
    relation: 'Self',
    avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    gender: userProfile?.gender || 'Other',
    age: userProfile?.age || 28,
  };

  const allMembers: SelectedPatientInfo[] = [
    selfMember,
    ...familyMembers.map((m) => ({
      id: m.id,
      name: m.name,
      relation: m.relation || 'Family',
      avatar: m.avatar || (m.relation?.toLowerCase().includes('mother') || m.gender?.toLowerCase() === 'female' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'),
      gender: m.gender,
      age: m.age,
    })),
  ];

  const handleSelect = (member: SelectedPatientInfo) => {
    triggerHaptic();
    onSelectMember(member);
  };

  const handleAddNewMember = (payload: NewFamilyMemberPayload) => {
    addFamilyMember({
      name: payload.name,
      relation: payload.relation,
      dob: payload.dob,
      gender: payload.gender,
      phone: payload.phone,
      age: payload.age,
      avatar: payload.gender?.toLowerCase() === 'female' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    });

    // Auto select the newly added member
    const newMemberInfo: SelectedPatientInfo = {
      id: `fam-${Date.now()}`,
      name: payload.name,
      relation: payload.relation,
      gender: payload.gender,
      age: payload.age,
    };
    onSelectMember(newMemberInfo);
    setShowAddMemberModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Users size={15} color={isDark ? '#34D399' : '#0D9488'} />
          <Text style={[styles.sectionTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
            Who is this visit for?
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.membersScroll}
      >
        {allMembers.map((member) => {
          const isSelected = selectedMemberId === member.id;
          const displayName = member.relation === 'Self' ? 'Myself' : (member.relation || member.name);

          return (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberCard,
                {
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5')
                    : (isDark ? '#24242B' : '#F8FAFC'),
                  borderColor: isSelected
                    ? (isDark ? '#34D399' : '#0D9488')
                    : (isDark ? '#2E2E36' : '#E2E8F0'),
                },
              ]}
              onPress={() => handleSelect(member)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <View style={[styles.selectedCheckBadge, { backgroundColor: isDark ? '#34D399' : '#0D9488' }]}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}

              <View style={styles.avatarWrapper}>
                {member.avatar ? (
                  <Image
                    source={{ uri: member.avatar }}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: isDark ? '#374151' : '#E2E8F0' }]}>
                    <User size={18} color={isDark ? '#9CA3AF' : '#64748B'} />
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.memberName,
                  {
                    color: isSelected
                      ? (isDark ? '#34D399' : '#0D9488')
                      : (isDark ? '#CBD5E1' : '#334155'),
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Add Family Member Button */}
        <TouchableOpacity
          style={[
            styles.addMemberCard,
            {
              backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
              borderColor: isDark ? '#374151' : '#CBD5E1',
            },
          ]}
          onPress={() => {
            triggerHaptic();
            setShowAddMemberModal(true);
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.addIconCircle, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
            <Plus size={16} color={isDark ? '#9CA3AF' : '#475569'} strokeWidth={2.2} />
          </View>
          <Text style={[styles.addMemberText, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
            Add Member
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Family Member Modal Sheet */}
      <AddFamilyMemberModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleAddNewMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  membersScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  memberCard: {
    width: 80,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    marginBottom: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  addMemberCard: {
    width: 80,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addMemberText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
