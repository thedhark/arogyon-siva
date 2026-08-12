import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface MemberAddedSuccessModalProps {
  visible: boolean;
  memberName: string;
  gender?: string;
  onDone: () => void;
}

export default function MemberAddedSuccessModal({
  visible,
  memberName,
  gender,
  onDone,
}: MemberAddedSuccessModalProps) {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  const isFemale = gender?.toLowerCase() === 'female';
  const pronoun = isFemale ? 'She' : (gender?.toLowerCase() === 'male' ? 'He' : 'They');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={styles.overlay}>
        <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Drag Pill */}
          <View style={styles.dragPillWrapper}>
            <View style={[styles.dragPill, { backgroundColor: isDark ? '#444' : '#D1D5DB' }]} />
          </View>

          {/* Sparkles / Confetti Visual Background */}
          <View style={styles.contentBody}>
            <View style={styles.sparklesBox}>
              <Sparkles size={24} color="#FBBF24" style={styles.sparkleTopLeft} />
              <Sparkles size={18} color="#38BDF8" style={styles.sparkleTopRight} />
              <Sparkles size={20} color="#F472B6" style={styles.sparkleBottomLeft} />
              <Sparkles size={22} color="#34D399" style={styles.sparkleBottomRight} />

              <View style={styles.greenOuterRing}>
                <View style={styles.greenCheckBadge}>
                  <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
                </View>
              </View>
            </View>

            {/* Headline */}
            <Text style={[styles.title, { color: colors.text }]}>
              {memberName || 'Member'} added successfully!
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              {pronoun} has been assigned to this appointment.
            </Text>

            {/* Done Action Button */}
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>Done</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  dragPillWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  sparklesBox: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 10,
    left: 15,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: 15,
    left: 20,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  greenOuterRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenCheckBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  doneBtn: {
    backgroundColor: '#0D9488',
    height: 52,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
