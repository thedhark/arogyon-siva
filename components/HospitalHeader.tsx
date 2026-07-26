import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft, Share2, PhoneCall, Info } from 'lucide-react-native';

interface HospitalHeaderProps {
  onBackPress: () => void;
  onSharePress?: () => void;
  onCallPress?: () => void;
  onInfoPress?: () => void;
}

export default function HospitalHeader({
  onBackPress,
  onSharePress,
  onCallPress,
  onInfoPress,
}: HospitalHeaderProps) {
  return (
    <View style={styles.headerAbsolute}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} style={styles.whiteCircleBtn} activeOpacity={0.8}>
        <ChevronLeft color="#0F172A" size={22} />
      </TouchableOpacity>

      {/* Floating Action Pill Bar */}
      <View style={styles.actionPillBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={onSharePress} activeOpacity={0.7}>
          <Share2 color="#1E293B" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onCallPress} activeOpacity={0.7}>
          <PhoneCall color="#1E293B" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onInfoPress} activeOpacity={0.7}>
          <Info color="#1E293B" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 36,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  whiteCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  actionPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
