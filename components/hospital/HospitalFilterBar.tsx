import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SlidersHorizontal, ChevronDown, Star, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  selectedSpecialty: string;
  isHighlyRecommended: boolean;
  isAvailableToday: boolean;
  onToggleHighlyRecommended: () => void;
  onToggleAvailableToday: () => void;
  onOpenFilterModal: () => void;
  onOpenSpecialtyModal: () => void;
  categoryEmoji?: string;
}

export default function HospitalFilterBar({
  selectedSpecialty,
  isHighlyRecommended,
  isAvailableToday,
  onToggleHighlyRecommended,
  onToggleAvailableToday,
  onOpenFilterModal,
  onOpenSpecialtyModal,
  categoryEmoji = '❤️',
}: Props) {
  const { colors, isDark } = useTheme();

  const chipBg = isDark ? '#1E1E24' : '#FFFFFF';
  const chipBorder = isDark ? '#27272A' : '#E2E8F0';
  const activeBg = isDark ? '#172554' : '#EFF6FF';
  const activeBorder = isDark ? '#2563EB' : '#BFDBFE';
  const activeText = isDark ? '#60A5FA' : '#1D4ED8';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* 1. Filters Button */}
      <TouchableOpacity
        style={[
          styles.chip,
          { backgroundColor: chipBg, borderColor: chipBorder },
        ]}
        onPress={onOpenFilterModal}
        activeOpacity={0.7}
      >
        <SlidersHorizontal size={14} color={isDark ? '#9CA3AF' : '#475569'} />
        <Text style={[styles.chipText, { color: colors.text }]}>Filters</Text>
        <ChevronDown size={14} color={isDark ? '#9CA3AF' : '#475569'} />
      </TouchableOpacity>

      {/* 2. Highly Recommended Pill */}
      <TouchableOpacity
        style={[
          styles.chip,
          isHighlyRecommended
            ? { backgroundColor: activeBg, borderColor: activeBorder }
            : { backgroundColor: chipBg, borderColor: chipBorder },
        ]}
        onPress={onToggleHighlyRecommended}
        activeOpacity={0.7}
      >
        <View style={[styles.starBadge, isHighlyRecommended && { backgroundColor: '#2563EB' }]}>
          <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <Text
          style={[
            styles.chipText,
            { color: isHighlyRecommended ? activeText : colors.text },
          ]}
        >
          Highly recommended
        </Text>
      </TouchableOpacity>

      {/* 3. Specialty Dropdown Chip */}
      <TouchableOpacity
        style={[
          styles.chip,
          selectedSpecialty !== 'All'
            ? { backgroundColor: activeBg, borderColor: activeBorder }
            : { backgroundColor: chipBg, borderColor: chipBorder },
        ]}
        onPress={onOpenSpecialtyModal}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 13, marginRight: 2 }}>{categoryEmoji}</Text>
        <Text
          style={[
            styles.chipText,
            { color: selectedSpecialty !== 'All' ? activeText : colors.text },
          ]}
        >
          {selectedSpecialty === 'All' ? 'Cardiology' : selectedSpecialty}
        </Text>
        <ChevronDown
          size={14}
          color={selectedSpecialty !== 'All' ? activeText : (isDark ? '#9CA3AF' : '#475569')}
        />
      </TouchableOpacity>

      {/* 4. Available Today Chip */}
      <TouchableOpacity
        style={[
          styles.chip,
          isAvailableToday
            ? { backgroundColor: activeBg, borderColor: activeBorder }
            : { backgroundColor: chipBg, borderColor: chipBorder },
        ]}
        onPress={onToggleAvailableToday}
        activeOpacity={0.7}
      >
        <Calendar
          size={14}
          color={isAvailableToday ? activeText : (isDark ? '#9CA3AF' : '#475569')}
        />
        <Text
          style={[
            styles.chipText,
            { color: isAvailableToday ? activeText : colors.text },
          ]}
        >
          Available today
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  starBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
