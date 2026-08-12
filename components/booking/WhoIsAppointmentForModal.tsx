import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface FamilyMemberItem {
  id: string;
  name: string;
  relation: string;
  age: string | number;
  gender: string;
  avatar?: string;
}

interface WhoIsAppointmentForModalProps {
  visible: boolean;
  selectedMemberId: string;
  members: FamilyMemberItem[];
  onClose: () => void;
  onSelectMember: (member: FamilyMemberItem) => void;
  onOpenAddMember: () => void;
}

export default function WhoIsAppointmentForModal({
  visible,
  selectedMemberId,
  members,
  onClose,
  onSelectMember,
  onOpenAddMember,
}: WhoIsAppointmentForModalProps) {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdropPressable} onPress={onClose} activeOpacity={1} />

        <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Drag Pill */}
          <View style={styles.dragPillWrapper}>
            <View style={[styles.dragPill, { backgroundColor: isDark ? '#444' : '#D1D5DB' }]} />
          </View>

          {/* Title Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Who is this appointment for?</Text>
            <Text style={styles.subtitle}>Select a family member</Text>
          </View>

          {/* Family Members List */}
          <ScrollView
            style={styles.listScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {members.map((member) => {
              const isSelected = member.id === selectedMemberId;
              const isSelf = member.relation.toLowerCase() === 'self';
              const relationDisplay = isSelf ? '(Self)' : `(${member.relation})`;

              return (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberCard,
                    {
                      borderColor: isSelected
                        ? '#0D9488'
                        : (isDark ? '#333333' : '#E5E7EB'),
                      backgroundColor: isSelected
                        ? (isDark ? '#112D29' : '#F0FDFA')
                        : (isDark ? '#262626' : '#FFFFFF'),
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => onSelectMember(member)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri: member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                    }}
                    style={styles.avatar}
                  />

                  <View style={styles.memberInfo}>
                    <Text style={styles.nameRow} numberOfLines={1}>
                      <Text style={[styles.memberName, { color: colors.text }]}>{member.name} </Text>
                      <Text style={styles.relationText}>{relationDisplay}</Text>
                    </Text>
                    <Text style={styles.memberSubtext}>
                      {member.gender} • {member.age} years
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmarkCircle}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Add Family Member Card */}
            <TouchableOpacity
              style={[
                styles.addCard,
                {
                  borderColor: isDark ? '#112D29' : '#CCFBF1',
                  backgroundColor: isDark ? 'rgba(13, 148, 136, 0.08)' : '#F0FDFA',
                },
              ]}
              onPress={onOpenAddMember}
              activeOpacity={0.7}
            >
              <View style={styles.plusCircle}>
                <Plus size={20} color="#0D9488" strokeWidth={2.5} />
              </View>
              <Text style={styles.addText}>Add Family Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  dragPillWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginTop: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  listScroll: {
    maxHeight: 400,
  },
  listContent: {
    gap: 12,
    paddingBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    fontSize: 15,
  },
  memberName: {
    fontWeight: '800',
  },
  relationText: {
    color: '#0D9488',
    fontWeight: '700',
  },
  memberSubtext: {
    fontSize: 12.5,
    color: '#9CA3AF',
    marginTop: 3,
  },
  checkmarkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D9488',
  },
});
