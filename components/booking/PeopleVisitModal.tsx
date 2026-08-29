import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Check, Plus, UserPlus, ArrowRight, User, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useProfileStore } from '@/hooks/useProfileStore';
import FamilyIllustration from '@/components/booking/FamilyIllustration';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  onAddMemberPress?: () => void;
}

const PRIMARY_PURPLE = '#4F46E5';
const RELATION_OPTIONS = ['Spouse', 'Mother', 'Father', 'Son', 'Daughter', 'Sibling', 'Friend', 'Other'];
const GENDER_OPTIONS = ['Female', 'Male', 'Other'];

export default function PeopleVisitModal({
  visible,
  selectedIds,
  onToggleMember,
  onClose,
  onDone,
}: PeopleVisitModalProps) {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  // Inline "Add Member" slide-down state
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Spouse');
  const [newGender, setNewGender] = useState('Female');
  const [newAge, setNewAge] = useState('');

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

  const toggleInlineAddForm = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInlineAdd((prev) => !prev);
  };

  const handleSaveNewMember = () => {
    if (!newName.trim()) return;

    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const parsedAge = parseInt(newAge, 10) || 28;

    // Pick avatar based on gender/age
    let fallbackAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
    if (newGender === 'Male') {
      fallbackAvatar = parsedAge < 15
        ? 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=200'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200';
    } else if (parsedAge < 15) {
      fallbackAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200';
    }

    const newId = Math.random().toString(36).substring(7);

    addFamilyMember({
      name: newName.trim(),
      relation: newRelation,
      gender: newGender as 'Male' | 'Female' | 'Other',
      age: parsedAge,
      dob: `${2024 - parsedAge}-01-01`,
      avatar: fallbackAvatar,
    });

    // Auto-select the newly added member
    onToggleMember(newId);

    // Reset form and collapse
    setNewName('');
    setNewAge('');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInlineAdd(false);
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
          {/* Top Handle Bar */}
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: isDark ? '#3F3F46' : '#E2E8F0' },
            ]}
          />

          {/* Top Right Close Button */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              { backgroundColor: isDark ? '#27272A' : '#F8FAFC' },
            ]}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color={isDark ? '#CBD5E1' : '#334155'} strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Header Title & Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              People for this visit
            </Text>
            <Text style={styles.modalSubtitle}>
              Add for yourself, family, or friends.
            </Text>
          </View>

          {/* Scrollable Body Content */}
          <ScrollView
            style={styles.bodyScrollView}
            contentContainerStyle={styles.bodyScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Family Line-Art Illustration */}
            <FamilyIllustration isDark={isDark} />

            {/* Multiple Rows (Flex Wrap Grid) - No horizontal scroll needed */}
            <View style={styles.peopleGrid}>
              {allMembers.map((member) => {
                const isSelected = selectedIds.includes(member.id);

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberCard}
                    onPress={() => handleMemberPress(member.id)}
                    activeOpacity={0.75}
                  >
                    {/* Avatar Container with Checkmark Badge */}
                    <View style={styles.avatarContainer}>
                      <View
                        style={[
                          styles.avatarRing,
                          isSelected && styles.avatarRingSelected,
                          { borderColor: isSelected ? PRIMARY_PURPLE : 'transparent' },
                        ]}
                      >
                        {member.avatar ? (
                          <Image
                            source={{ uri: member.avatar }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <View
                            style={[
                              styles.avatarFallback,
                              { backgroundColor: isDark ? '#27272A' : '#EEF2FF' },
                            ]}
                          >
                            <User size={24} color={PRIMARY_PURPLE} />
                          </View>
                        )}
                      </View>

                      {/* Checkmark Badge pinned to top-left */}
                      {isSelected && (
                        <View style={styles.checkBadge}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3.2} />
                        </View>
                      )}
                    </View>

                    {/* Name & Relation */}
                    <Text
                      style={[
                        styles.memberName,
                        { color: colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {member.name}
                    </Text>
                    <Text style={styles.memberRelation} numberOfLines={1}>
                      {member.relation}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Add More Dashed Circle Button in Grid */}
              <TouchableOpacity
                style={styles.memberCard}
                onPress={toggleInlineAddForm}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.addMoreCircle,
                    {
                      borderColor: showInlineAdd
                        ? PRIMARY_PURPLE
                        : (isDark ? 'rgba(99, 102, 241, 0.4)' : '#C7D2FE'),
                      backgroundColor: showInlineAdd
                        ? (isDark ? '#312E81' : '#EEF2FF')
                        : (isDark ? 'rgba(99, 102, 241, 0.08)' : '#F5F3FF'),
                    },
                  ]}
                >
                  {showInlineAdd ? (
                    <ChevronUp size={22} color={PRIMARY_PURPLE} strokeWidth={2.6} />
                  ) : (
                    <Plus size={22} color={PRIMARY_PURPLE} strokeWidth={2.6} />
                  )}
                </View>
                <Text style={styles.addMoreLabel}>
                  {showInlineAdd ? 'Close' : 'Add more'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* -------------------------------------------------------------
                INLINE SLIDE-DOWN FORM: Smooth dropdown without modal popups
               ------------------------------------------------------------- */}
            {showInlineAdd && (
              <View
                style={[
                  styles.inlineFormCard,
                  {
                    backgroundColor: isDark ? '#1E1B4B30' : '#F5F3FF',
                    borderColor: isDark ? '#4338CA' : '#C7D2FE',
                  },
                ]}
              >
                <View style={styles.inlineFormHeader}>
                  <Text style={[styles.inlineFormTitle, { color: colors.text }]}>
                    Add Family or Friend
                  </Text>
                  <TouchableOpacity onPress={toggleInlineAddForm}>
                    <X size={18} color={isDark ? '#CBD5E1' : '#64748B'} />
                  </TouchableOpacity>
                </View>

                {/* Relationship Chips */}
                <Text style={styles.fieldLabel}>Relationship</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}
                  style={styles.chipsRow}
                >
                  {RELATION_OPTIONS.map((rel) => {
                    const isRelActive = newRelation === rel;
                    return (
                      <TouchableOpacity
                        key={rel}
                        style={[
                          styles.chipPill,
                          isRelActive
                            ? styles.chipPillActive
                            : [
                                styles.chipPillInactive,
                                {
                                  backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                                  borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                },
                              ],
                        ]}
                        onPress={() => {
                          setNewRelation(rel);
                          if (rel === 'Mother' || rel === 'Daughter') setNewGender('Female');
                          else if (rel === 'Father' || rel === 'Son') setNewGender('Male');
                        }}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: isRelActive ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#334155') },
                          ]}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Full Name Input */}
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                      borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                      color: colors.text,
                    },
                  ]}
                  placeholder="e.g. Lakshmi K."
                  placeholderTextColor={isDark ? '#71717A' : '#94A3B8'}
                  value={newName}
                  onChangeText={setNewName}
                />

                {/* Gender & Age Row */}
                <View style={styles.inlineRow}>
                  {/* Gender Chips */}
                  <View style={styles.inlineColFlex}>
                    <Text style={styles.fieldLabel}>Gender</Text>
                    <View style={styles.genderRow}>
                      {GENDER_OPTIONS.map((g) => {
                        const isGActive = newGender === g;
                        return (
                          <TouchableOpacity
                            key={g}
                            style={[
                              styles.genderPill,
                              isGActive
                                ? styles.chipPillActive
                                : [
                                    styles.chipPillInactive,
                                    {
                                      backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                                      borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                    },
                                  ],
                            ]}
                            onPress={() => setNewGender(g)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                { color: isGActive ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#334155') },
                              ]}
                            >
                              {g}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Age Input */}
                  <View style={styles.inlineColAge}>
                    <Text style={styles.fieldLabel}>Age</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                          borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                          color: colors.text,
                        },
                      ]}
                      placeholder="e.g. 26"
                      placeholderTextColor={isDark ? '#71717A' : '#94A3B8'}
                      keyboardType="number-pad"
                      maxLength={3}
                      value={newAge}
                      onChangeText={setNewAge}
                    />
                  </View>
                </View>

                {/* Inline Submit Action */}
                <TouchableOpacity
                  style={[
                    styles.saveMemberBtn,
                    { opacity: newName.trim() ? 1 : 0.5 },
                  ]}
                  onPress={handleSaveNewMember}
                  disabled={!newName.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveMemberBtnText}>Save & Add to Visit</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Bottom Action / Summary Bar */}
          <View
            style={[
              styles.footerBar,
              {
                borderTopColor: isDark ? '#27272A' : '#F1F5F9',
                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
              },
            ]}
          >
            {/* Left Info: Icon + Count Stack */}
            <View style={styles.footerLeft}>
              <View
                style={[
                  styles.footerIconBox,
                  { backgroundColor: isDark ? '#2E1065' : '#F0F3FF' },
                ]}
              >
                <UserPlus size={22} color={PRIMARY_PURPLE} strokeWidth={2.2} />
              </View>
              <View style={styles.footerTextCol}>
                <Text
                  style={[
                    styles.selectedCountTitle,
                    { color: selectedCount > 0 ? PRIMARY_PURPLE : (isDark ? '#94A3B8' : '#64748B') },
                  ]}
                >
                  {selectedCount} selected
                </Text>
                <Text style={styles.selectedCountSubtitle}>
                  Up to 10 people
                </Text>
              </View>
            </View>

            {/* Right Action: Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                { opacity: selectedCount > 0 ? 1 : 0.6 },
              ]}
              onPress={handleDonePress}
              disabled={selectedCount === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
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
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '92%',
    height: '84%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 24,
    borderWidth: 1,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 6,
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
  },
  bodyScrollView: {
    flex: 1,
  },
  bodyScrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 12,
    marginTop: 8,
  },
  memberCard: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRingSelected: {
    borderWidth: 2.2,
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
  checkBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 5,
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  memberName: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: -0.1,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  memberRelation: {
    fontFamily: Fonts.semiBold,
    fontSize: 10.5,
    fontWeight: '600',
    color: PRIMARY_PURPLE,
    textAlign: 'center',
    marginTop: 2,
    width: '100%',
    paddingHorizontal: 2,
  },
  addMoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.6,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addMoreLabel: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_PURPLE,
    textAlign: 'center',
    marginTop: 4,
  },
  inlineFormCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  inlineFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inlineFormTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  fieldLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 6,
  },
  chipsRow: {
    marginBottom: 8,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipPillActive: {
    backgroundColor: PRIMARY_PURPLE,
    borderWidth: 1,
    borderColor: PRIMARY_PURPLE,
  },
  chipPillInactive: {
    borderWidth: 1,
  },
  chipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  inlineColFlex: {
    flex: 1,
  },
  inlineColAge: {
    width: 80,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveMemberBtn: {
    backgroundColor: PRIMARY_PURPLE,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveMemberBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTextCol: {
    justifyContent: 'center',
  },
  selectedCountTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  selectedCountSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  continueButton: {
    backgroundColor: PRIMARY_PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
