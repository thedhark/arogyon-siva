import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Calendar, ChevronDown, Plus } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';
import { useProfileStore } from '@/hooks/useProfileStore';
import PeopleVisitModal, { PatientMember } from '@/components/booking/PeopleVisitModal';
import AddFamilyMemberModal, { NewFamilyMemberPayload } from '@/components/booking/AddFamilyMemberModal';

export interface SelectedPatientInfo {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
}

interface Props {
  initialCount?: number;
  initialMemberId?: string;
  initialSelectedIds?: string[];
  buttonLabel?: string;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  compact?: boolean;
  onCountChange?: (count: number, primaryMember: SelectedPatientInfo, allMembers?: SelectedPatientInfo[]) => void;
  onBookPress?: (primaryMember: SelectedPatientInfo, allMembers?: SelectedPatientInfo[]) => void;
  onMembersChange?: (allMembers: SelectedPatientInfo[]) => void;
}

const MIDNIGHT_NAVY = '#0C203E';
const NAVY_BORDER = '#2563EB';

// Light minimal grape / purple styling for Step 0 Book Visit capsule
const GRAPE_BG = '#F5F3FF';
const GRAPE_BORDER = '#6527BE';
const GRAPE_TEXT = '#6527BE';

export default function BookVisitSelector({
  initialCount = 0,
  initialMemberId = 'me',
  initialSelectedIds,
  buttonLabel = 'ADD VISIT',
  icon: CustomIcon,
  compact = false,
  onCountChange,
  onBookPress,
  onMembersChange,
}: Props) {
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  // Selected member IDs
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialSelectedIds && initialSelectedIds.length > 0) {
      return initialSelectedIds;
    }
    if (initialCount > 0) {
      return [initialMemberId || 'me'];
    }
    return [];
  });

  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(style);
      }
    } catch {
      // Ignore
    }
  };

  // Full registry of members
  const allMembersRegistry: PatientMember[] = [
    {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
      avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
    },
    ...familyMembers.map((m) => ({
      id: m.id,
      name: m.name,
      relation: m.relation || 'Family',
      avatar: m.avatar,
    })),
  ];

  const getSelectedMembers = (ids: string[]): SelectedPatientInfo[] => {
    return ids.map((id) => {
      const found = allMembersRegistry.find((m) => m.id === id);
      if (found) {
        return {
          id: found.id,
          name: found.name,
          relation: found.relation,
          avatar: found.avatar,
        };
      }
      return {
        id,
        name: 'Member',
        relation: 'Family',
      };
    });
  };

  // Step 0 -> Step 1: Initial "Book Visit" Button Click
  const handleInitialBook = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const newSelected = ['me'];
    setSelectedIds(newSelected);

    const selectedPatients = getSelectedMembers(newSelected);
    const primary = selectedPatients[0];

    if (onBookPress) onBookPress(primary, selectedPatients);
    if (onCountChange) onCountChange(newSelected.length, primary, selectedPatients);
    if (onMembersChange) onMembersChange(selectedPatients);
  };

  const handleOpenPeopleModal = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setIsPeopleModalOpen(true);
  };

  const handleToggleMember = (id: string) => {
    let next: string[];
    if (selectedIds.includes(id)) {
      next = selectedIds.filter((item) => item !== id);
    } else {
      next = [...selectedIds, id];
    }

    if (next.length === 0) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedIds([]);
      if (onCountChange) {
        const dummy: SelectedPatientInfo = { id: '', name: '', relation: '' };
        onCountChange(0, dummy, []);
      }
      if (onMembersChange) onMembersChange([]);
      return;
    }

    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(next);

    const selectedPatients = getSelectedMembers(next);
    const primary = selectedPatients[0];
    if (onCountChange) onCountChange(next.length, primary, selectedPatients);
    if (onMembersChange) onMembersChange(selectedPatients);
  };

  const handleModalDone = () => {
    setIsPeopleModalOpen(false);
    const selectedPatients = getSelectedMembers(selectedIds);
    const primary = selectedPatients[0] || {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
    };

    if (onCountChange) onCountChange(selectedIds.length, primary, selectedPatients);
    if (onMembersChange) onMembersChange(selectedPatients);
  };

  const handleAddMemberSubmit = (payload: NewFamilyMemberPayload) => {
    addFamilyMember({
      name: payload.name,
      relation: payload.relation,
      dob: payload.dob,
      age: payload.age,
      gender: payload.gender as 'Male' | 'Female' | 'Other',
      phone: payload.phone,
    });
    setShowAddMemberModal(false);
  };

  const selectedPatients = getSelectedMembers(selectedIds);
  const count = selectedPatients.length;
  const isSingle = count === 1;
  const singlePatient = selectedPatients[0];
  const isPackage = buttonLabel.toUpperCase().includes('PACKAGE');

  // Up to 5 avatars fit in full pill without cut-off
  const maxVisibleAvatars = 5;
  const visibleAvatars = selectedPatients.slice(0, maxVisibleAvatars);
  const overflowCount = count > maxVisibleAvatars ? count - maxVisibleAvatars : 0;

  return (
    <View style={[styles.rootContainer, compact && styles.compactRootContainer]}>
      {/* -------------------------------------------------------------
          STEP 0: Initial "Book Visit" Minimal Light Grape Tinted Capsule
          Light inside + light grape border spread
         ------------------------------------------------------------- */}
      {selectedIds.length === 0 ? (
        <TouchableOpacity
          style={[
            styles.initialBookBtn,
            compact && styles.compactInitialBookBtn,
          ]}
          onPress={handleInitialBook}
          activeOpacity={0.85}
        >
          {CustomIcon ? (
            <CustomIcon size={compact ? 15 : 17} color={GRAPE_TEXT} strokeWidth={2.4} />
          ) : isPackage ? (
            <Plus size={compact ? 16 : 17} color={GRAPE_TEXT} strokeWidth={2.6} />
          ) : (
            <Calendar size={compact ? 15 : 17} color={GRAPE_TEXT} strokeWidth={2.4} />
          )}
          <Text style={[styles.initialBookBtnText, compact && styles.compactInitialBookBtnText]}>
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      ) : (
        /* -------------------------------------------------------------
           STEPS 1, 2 & 3: Deep Navy Pill with Full Avatars (No premature +2 cut-off)
           ------------------------------------------------------------- */
        <TouchableOpacity
          style={[
            styles.mainPill,
            compact && styles.compactMainPill,
          ]}
          onPress={handleOpenPeopleModal}
          activeOpacity={0.8}
        >
          {/* STEP 1: Single Member Selected */}
          {isSingle && (
            <View style={styles.singleMemberContent}>
              <Image
                source={{
                  uri:
                    singlePatient?.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                }}
                style={[styles.singleAvatar, compact && styles.compactSingleAvatar]}
              />
              <Text
                style={[
                  styles.singleNameText,
                  compact && styles.compactSingleNameText,
                ]}
                numberOfLines={1}
              >
                {singlePatient?.name}
              </Text>
              <ChevronDown
                size={compact ? 14 : 16}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            </View>
          )}

          {/* MULTI-MEMBER: 2+ People Selected -> Renders all selected avatars without unnecessary +2 */}
          {!isSingle && (
            <View style={styles.multiMemberContent}>
              <View style={styles.avatarStack}>
                {visibleAvatars.map((p, idx) => (
                  <Image
                    key={p.id || idx}
                    source={{
                      uri:
                        p.avatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                    }}
                    style={[
                      styles.stackedAvatar,
                      compact && styles.compactStackedAvatar,
                      idx > 0 && styles.stackedAvatarOverlap,
                    ]}
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.peopleCountText,
                  compact && styles.compactPeopleCountText,
                ]}
              >
                {count} people
              </Text>

              {overflowCount > 0 && (
                <Text
                  style={[
                    styles.overflowText,
                    compact && styles.compactOverflowText,
                  ]}
                >
                  +{overflowCount}
                </Text>
              )}

              <ChevronDown
                size={compact ? 14 : 16}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* People for this visit Selection Modal */}
      {isPeopleModalOpen && (
        <PeopleVisitModal
          visible={isPeopleModalOpen}
          selectedIds={selectedIds}
          onToggleMember={handleToggleMember}
          onClose={() => setIsPeopleModalOpen(false)}
          onDone={handleModalDone}
          onAddMemberPress={() => {
            setIsPeopleModalOpen(false);
            setShowAddMemberModal(true);
          }}
        />
      )}

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <AddFamilyMemberModal
          visible={showAddMemberModal}
          onClose={() => {
            setShowAddMemberModal(false);
            setIsPeopleModalOpen(true);
          }}
          onSubmit={(payload) => {
            handleAddMemberSubmit(payload);
            setIsPeopleModalOpen(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    alignItems: 'center',
  },
  compactRootContainer: {
    width: '100%',
    alignItems: 'center',
  },
  initialBookBtn: {
    width: 136,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: GRAPE_BORDER,
    shadowColor: GRAPE_BORDER,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  compactInitialBookBtn: {
    width: 136,
    height: 42,
    borderRadius: 11,
    gap: 5,
  },
  initialBookBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '800',
    color: GRAPE_TEXT,
    letterSpacing: 0.2,
  },
  compactInitialBookBtnText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  mainPill: {
    width: 136,
    height: 42,
    backgroundColor: MIDNIGHT_NAVY,
    paddingHorizontal: 9,
    paddingLeft: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: NAVY_BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  compactMainPill: {
    width: 136,
    height: 42,
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingLeft: 7,
  },
  singleMemberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 7,
  },
  singleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // Crisp white halo
  },
  compactSingleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  singleNameText: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  compactSingleNameText: {
    fontSize: 12,
  },
  multiMemberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 6,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // Crisp white halo around all stacked avatars
  },
  compactStackedAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  stackedAvatarOverlap: {
    marginLeft: -8,
  },
  peopleCountText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.1,
    paddingHorizontal: 4,
  },
  compactPeopleCountText: {
    fontSize: 11.5,
  },
  overflowText: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 2,
  },
  compactOverflowText: {
    fontSize: 10.5,
  },
});
