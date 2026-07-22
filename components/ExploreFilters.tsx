import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SlidersHorizontal, MapPin, Star, Clock, CreditCard } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FILTERS = [
  { id: 'near_me', label: 'Near Me', icon: MapPin },
  { id: 'top_rated', label: 'Top Rated', icon: Star },
  { id: 'open_now', label: 'Open Now', icon: Clock },
  { id: 'cashless', label: 'Cashless', icon: CreditCard },
];

export default function ExploreFilters({ style }: { style?: any }) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
      >
        <TouchableOpacity style={[styles.filterPill, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <SlidersHorizontal size={12} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
        </TouchableOpacity>

        {FILTERS.map(f => (
          <TouchableOpacity key={f.id} style={[styles.filterPill, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
            <f.icon size={12} color={colors.textMuted} />
            <Text style={[styles.filterText, { color: colors.textMuted }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Removed marginBottom so the parent animated view doesn't clip the content
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 100, // Perfect pill shape
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  }
});
