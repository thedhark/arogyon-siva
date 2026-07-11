import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const FILTERS = ['All', 'Medical', 'Recovery', 'Preventive', 'Transformation'];

export default function PlansFilter() {
  const { colors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            placeholder="Search for plans, programs..." 
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        bounces={false}
        overScrollMode="never"
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.chip, 
                isActive ? styles.activeChip : { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.chipText, 
                { color: isActive ? '#1b5e55' : colors.textMuted }
              ]}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    marginHorizontal: -12,
  },
  filterContent: {
    paddingHorizontal: 12,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChip: {
    backgroundColor: '#e6f4f1',
    borderColor: '#1b5e55',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  }
});
