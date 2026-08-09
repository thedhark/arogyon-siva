import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

export const LAB_FILTER_CATEGORIES = [
  { id: 'all', label: 'All Tests' },
  { id: 'popular', label: 'Popular Checkups' },
  { id: 'vision', label: 'Lenskart Eye Care' },
  { id: 'cardiac', label: 'Heart & Lipid' },
  { id: 'diabetes', label: 'Diabetes Care' },
  { id: 'women', label: "Women's Health" },
  { id: 'vitamin', label: 'Vitamins & Minerals' },
];

interface LabCategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function LabCategoryFilter({ activeCategory, onSelectCategory }: LabCategoryFilterProps) {
  const { colors, isDark } = useTheme();

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCategory(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LAB_FILTER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                isActive
                  ? styles.activeChip
                  : { backgroundColor: isDark ? '#27272A' : '#F4F4F5', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
              ]}
              onPress={() => handleSelect(cat.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive
                    ? styles.activeChipText
                    : { color: isDark ? '#D4D4D8' : '#52525B' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeChip: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
