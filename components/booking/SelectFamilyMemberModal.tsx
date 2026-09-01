import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { User, Plus, X, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';
import AddFamilyMemberModal, { NewFamilyMemberPayload } from './AddFamilyMemberModal';
import { PatientSlotAssignment } from './MultiPersonSlotSheet';

interface SelectFamilyMemberModalProps {
  visible: boolean;
  alreadySelectedIds: string[];
  onClose: () => void;
  onSelectMember: (member: PatientSlotAssignment) => void;
}

const ACCENT_COLORS = ['#6366F1', '#059669', '#D97706', '#DB2777', '#2563EB'];

export default function SelectFamilyMemberModal({
  visible,
  alreadySelectedIds,
  onClose,
  onSelectMember,
}: SelectFamilyMemberModalProps) {
  const { isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  const [showAddModal, setShowAddModal] = useState(false);

  const allAvailable: PatientSlotAssignment[] = [
    {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
      avatar: userProfile?.avatar,
      selectedDate: 'Today, 30 Aug',
      selectedTime: '11:30 AM',
      accentColor: ACCENT_COLORS[0],
    },
    ...familyMembers.map((m, index) => ({
      id: m.id,
      name: m.name,
      relation: m.relation || 'Family',
      avatar: m.avatar,
      selectedDate: 'Today, 30 Aug',
      selectedTime: '12:15 PM',
      accentColor: ACCENT_COLORS[(index + 1) % ACCENT_COLORS.length],
    })),
  ];

  const handleChoose = (patient: PatientSlotAssignment) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    onSelectMember(patient);
    onClose();
  };

  const handleAddNewMember = (payload: NewFamilyMemberPayload) => {
    addFamilyMember({
      name: payload.name,
      relation: payload.relation,
      dob: payload.dob,
      gender: payload.gender,
      phone: payload.phone,
      age: payload.age,
    });

    const newMember: PatientSlotAssignment = {
      id: `fam-${Date.now()}`,
      name: payload.name,
      relation: payload.relation,
      selectedDate: 'Today, 30 Aug',
      selectedTime: '01:00 PM',
      accentColor: ACCENT_COLORS[(familyMembers.length + 1) % ACCENT_COLORS.length],
    };

    setShowAddModal(false);
    onSelectMember(newMember);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#12141A' : '#FFFFFF' },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handleBar} />

          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Add Person for Visit
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {allAvailable.map((item, idx) => {
              const isAlreadyAdded = alreadySelectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={`${item.id}-${idx}`}
                  disabled={isAlreadyAdded}
                  style={[
                    styles.memberRow,
                    {
                      backgroundColor: isAlreadyAdded
                        ? (isDark ? '#181A22' : '#F8FAFC')
                        : (isDark ? '#1C1F26' : '#FFFFFF'),
                      borderColor: isDark ? '#2E3340' : '#E2E8F0',
                      opacity: isAlreadyAdded ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => handleChoose(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.memberLeft}>
                    <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#262A36' : '#EEF2FF' }]}>
                      <User size={18} color={item.accentColor || '#6366F1'} />
                    </View>
                    <View>
                      <Text style={[styles.memberName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.memberRelation, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {item.relation}
                      </Text>
                    </View>
                  </View>

                  {isAlreadyAdded ? (
                    <View style={styles.addedBadge}>
                      <Text style={styles.addedText}>Added</Text>
                    </View>
                  ) : (
                    <View style={[styles.selectBtn, { borderColor: isDark ? '#3E4557' : '#CBD5E1' }]}>
                      <Plus size={16} color={item.accentColor || '#6366F1'} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Add New Member Button */}
            <TouchableOpacity
              style={[
                styles.addNewBtn,
                {
                  backgroundColor: isDark ? '#1C1F26' : '#F5F3FF',
                  borderColor: isDark ? '#4F46E5' : '#818CF8',
                },
              ]}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={18} color="#6366F1" strokeWidth={2.4} />
              <Text style={styles.addNewText}>Add New Family Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>

      <AddFamilyMemberModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddNewMember}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: '75%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handleBar: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  listScroll: {
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  memberRelation: {
    fontSize: 12,
    marginTop: 2,
  },
  addedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  addedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 6,
    marginBottom: 16,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
});
