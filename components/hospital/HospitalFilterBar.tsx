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
  const defaultText = isDark ? '#E2E8F0' : '#1E293B';
  const iconColor = isDark ? '#9CA3AF' : '#64748B';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      contentContainerStyle={styles.container}
    >
      {/* 1. Filters Button */}
      <TouchableOpacity
        style={[
          styles.chip,
          { backgroundColor: chipBg, borderColor: chipBorder },
        ]}
        onPress={onOpenFilterModal}
        activeOpacity={0.8}
      >
        <SlidersHorizontal size={14} color={iconColor} />
        <Text style={[styles.chipText, { color: defaultText }]}>Filters</Text>
        <ChevronDown size={14} color={iconColor} />
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
        activeOpacity={0.8}
      >
        <View style={[
          styles.starBadge, 
          { backgroundColor: isHighlyRecommended ? '#2563EB' : (isDark ? '#27272A' : '#EFF6FF') }
        ]}>
          <Star 
            size={11} 
            color={isHighlyRecommended ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#2563EB')} 
            fill={isHighlyRecommended ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#2563EB')} 
          />
        </View>
        <Text
          style={[
            styles.chipText,
            { color: isHighlyRecommended ? activeText : defaultText },
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
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 13, marginRight: 2 }}>{categoryEmoji}</Text>
        <Text
          style={[
            styles.chipText,
            { color: selectedSpecialty !== 'All' ? activeText : defaultText },
          ]}
        >
          {selectedSpecialty === 'All' ? 'Cardiology' : selectedSpecialty}
        </Text>
        <ChevronDown
          size={14}
          color={selectedSpecialty !== 'All' ? activeText : iconColor}
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
        activeOpacity={0.8}
      >
        <Calendar
          size={14}
          color={isAvailableToday ? activeText : iconColor}
        />
        <Text
          style={[
            styles.chipText,
            { color: isAvailableToday ? activeText : defaultText },
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
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    includeFontPadding: false,
  },
  starBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
