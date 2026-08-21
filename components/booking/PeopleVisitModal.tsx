import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Check, Plus, ChevronRight, User } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useProfileStore } from '@/hooks/useProfileStore';

export interface PatientMember {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  gender?: string;
  age?: number;
}

interface PeopleVisitModalProps {
  visible: boolean;
  selectedIds: string[];
  onToggleMember: (id: string) => void;
  onClose: () => void;
  onDone: () => void;
  onAddMemberPress: () => void;
}

const PRIMARY_PURPLE = '#4F46E5';

export default function PeopleVisitModal({
  visible,
  selectedIds,
  onToggleMember,
  onClose,
  onDone,
  onAddMemberPress,
}: PeopleVisitModalProps) {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(style);
      }
    } catch {
      // Ignore if haptics unavailable
    }
  };

  // Build full member list starting with Self
  const allMembers: PatientMember[] = [
    {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
      avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
      gender: userProfile?.gender,
      age: userProfile?.age,
    },
    ...familyMembers.map((m) => ({
      id: m.id,
      name: m.name,
      relation: m.relation || 'Family',
      avatar: m.avatar,
      gender: m.gender,
      age: m.age,
    })),
  ];

  const selectedCount = selectedIds.length;

  const handleMemberPress = (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    onToggleMember(id);
  };

  const handleDonePress = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    onDone();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropPressable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: isDark ? '#18181B' : '#FFFFFF',
              borderColor: isDark ? '#27272A' : '#E2E8F0',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                People for this visit
              </Text>
              <Text style={styles.modalSubtitle}>
                Select people who will be part of this visit.
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? '#27272A' : '#F1F5F9' },
              ]}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={isDark ? '#CBD5E1' : '#334155'} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          {/* Family & Group Appointment Notice Banner */}
          <View
            style={[
              styles.infoBanner,
              {
                backgroundColor: isDark ? '#2E1065' : '#EEF2FF',
                borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : '#E0E7FF',
              },
            ]}
          >
            <Text
              style={[
                styles.infoBannerText,
                { color: isDark ? '#C7D2FE' : '#4338CA' },
              ]}
            >
              💡 You can book another appointment for family, group, or others in this single visit.
            </Text>
          </View>

          {/* Members List */}
          <ScrollView
            style={styles.memberListScroll}
            showsVerticalScrollIndicator={false}
          >
            {allMembers.map((member) => {
              const isSelected = selectedIds.includes(member.id);

              return (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberRow,
                    isSelected && {
                      backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                    },
                  ]}
                  onPress={() => handleMemberPress(member.id)}
                  activeOpacity={0.7}
                >
                  {/* Custom Purple Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      isSelected
                        ? styles.checkboxChecked
                        : [
                            styles.checkboxUnchecked,
                            { borderColor: isDark ? '#52525B' : '#CBD5E1' },
                          ],
                    ]}
                  >
                    {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>

                  {/* Avatar */}
                  <View style={styles.avatarWrapper}>
                    {member.avatar ? (
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.avatarFallback,
                          { backgroundColor: isDark ? '#3F3F46' : '#EEF2FF' },
                        ]}
                      >
                        <User size={18} color={PRIMARY_PURPLE} />
                      </View>
                    )}
                  </View>

                  {/* Member Name */}
                  <Text
                    style={[
                      styles.memberNameText,
                      { color: colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>

                  {/* Relationship Badge Pill */}
                  <View
                    style={[
                      styles.relationBadge,
                      {
                        backgroundColor: isDark ? '#2E1065' : '#EEF2FF',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.relationBadgeText,
                        { color: isDark ? '#C7D2FE' : PRIMARY_PURPLE },
                      ]}
                    >
                      {member.relation}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <View
              style={[
                styles.divider,
                { backgroundColor: isDark ? '#27272A' : '#F1F5F9' },
              ]}
            />

            {/* + Add member Row */}
            <TouchableOpacity
              style={styles.addMemberRow}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                onAddMemberPress();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.addIconCircle}>
                <Plus size={16} color={PRIMARY_PURPLE} strokeWidth={2.8} />
              </View>
              <Text style={styles.addMemberLabel}>Add member</Text>
              <ChevronRight
                size={18}
                color={PRIMARY_PURPLE}
                strokeWidth={2.2}
                style={styles.addChevron}
              />
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Action Bar */}
          <View
            style={[
              styles.footerBar,
              {
                borderTopColor: isDark ? '#27272A' : '#F1F5F9',
              },
            ]}
          >
            <Text
              style={[
                styles.selectedCountText,
                { color: selectedCount > 0 ? PRIMARY_PURPLE : '#94A3B8' },
              ]}
            >
              {selectedCount} selected
            </Text>

            <TouchableOpacity
              style={[
                styles.doneButton,
                { opacity: selectedCount > 0 ? 1 : 0.6 },
              ]}
              onPress={handleDonePress}
              disabled={selectedCount === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberListScroll: {
    maxHeight: 340,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginBottom: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_PURPLE,
  },
  checkboxUnchecked: {
    borderWidth: 1.8,
    backgroundColor: 'transparent',
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
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
  memberNameText: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  relationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  relationBadgeText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  addIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addMemberLabel: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_PURPLE,
  },
  addChevron: {
    marginLeft: 8,
  },
  infoBanner: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoBannerText: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    lineHeight: 17,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  selectedCountText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '800',
  },
  doneButton: {
    backgroundColor: PRIMARY_PURPLE,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  doneButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
