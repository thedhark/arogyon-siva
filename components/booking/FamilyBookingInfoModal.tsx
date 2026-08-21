import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Users, UserPlus as UserPlusIcon, Plus, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import GroupAddIcon from '@/components/booking/icons/GroupAddIcon';

interface Props {
  visible: boolean;
  selectedCount: number;
  selectedNames: string[];
  onClose: () => void;
  onSelectPeoplePress: () => void;
  onAddNewMemberPress: () => void;
}

const PRIMARY_PURPLE = '#4F46E5';

export default function FamilyBookingInfoModal({
  visible,
  selectedCount,
  selectedNames,
  onClose,
  onSelectPeoplePress,
  onAddNewMemberPress,
}: Props) {
  const { colors, isDark } = useTheme();

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(style);
      }
    } catch {
      // Ignore
    }
  };

  const handleSelectPeople = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    onSelectPeoplePress();
  };

  const handleAddNew = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    onAddNewMemberPress();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1917' : '#FFFFFF',
              borderColor: isDark ? '#27272A' : '#E2E8F0',
            },
          ]}
        >
          {/* Top Close Button (Wrong mark 'X') */}
          <TouchableOpacity
            style={[
              styles.closeBtn,
              { backgroundColor: isDark ? '#27272A' : '#F1F5F9' },
            ]}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={isDark ? '#CBD5E1' : '#334155'} strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Icon Badge */}
          <View style={styles.iconCircle}>
            <GroupAddIcon size={30} color={PRIMARY_PURPLE} strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Book for Family & Others
          </Text>

          {/* Message text as requested */}
          <Text style={styles.messageText}>
            You can book another appointment for family, group, or others in this visit.
          </Text>

          {/* Active selection summary pill */}
          <View
            style={[
              styles.selectionSummary,
              { backgroundColor: isDark ? '#2E1065' : '#EEF2FF' },
            ]}
          >
            <Users size={14} color={PRIMARY_PURPLE} style={{ marginRight: 6 }} />
            <Text style={styles.selectionSummaryText} numberOfLines={1}>
              {selectedCount === 1
                ? `1 person (${selectedNames[0] || 'Self'})`
                : `${selectedCount} people selected`}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsCol}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSelectPeople}
              activeOpacity={0.85}
            >
              <Users size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Select / Manage People</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryBtn,
                {
                  borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                  backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                },
              ]}
              onPress={handleAddNew}
              activeOpacity={0.75}
            >
              <Plus size={16} color={PRIMARY_PURPLE} strokeWidth={2.5} style={{ marginRight: 6 }} />
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
                Add New Family Member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1.2,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  selectionSummaryText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
    fontWeight: '700',
    color: PRIMARY_PURPLE,
  },
  actionsCol: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: PRIMARY_PURPLE,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    fontWeight: '700',
  },
});
