import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, ChevronDown, Check, SlidersHorizontal } from 'lucide-react-native';

interface Props {
  location?: string;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  onPressLocation?: () => void;
  colors: any;
  isDark: boolean;
}

const FILTER_OPTIONS = [
  'Cashless',
  'Insurance Covered',
  'Budget-Friendly',
  'Top Rated',
  '24x7 Emergency',
  'Available Today',
];

export default function CategoryFilterBar({
  location = 'Bangalore, Karnataka',
  selectedFilters,
  onToggleFilter,
  onPressLocation,
  colors,
  isDark,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Top Location & Main Filter Row */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.locationSelector} onPress={onPressLocation} activeOpacity={0.7}>
          <MapPin size={15} color="#6366F1" />
          <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
            {location}
          </Text>
          <ChevronDown size={15} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterIconButton, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6', 
              borderColor: isDark ? '#333' : '#E5E7EB' 
            }
          ]}
        >
          <SlidersHorizontal size={14} color="#6366F1" />
          <Text style={styles.filterIconButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Quick Filters Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => onToggleFilter(filter)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isSelected
                  ? styles.chipSelected
                  : { 
                      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', 
                      borderColor: isDark ? '#333' : '#E5E7EB' 
                    },
              ]}
            >
              {isSelected && <Check size={12} color="#FFFFFF" style={styles.chipCheck} />}
              <Text
                style={[
                  styles.chipText,
                  isSelected
                    ? styles.chipTextSelected
                    : { color: isDark ? '#D1D5DB' : '#4B5563' },
                ]}
              >
                {filter}
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
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterIconButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  chipCheck: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
