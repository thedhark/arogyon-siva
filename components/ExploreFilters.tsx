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
          <SlidersHorizontal size={14} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
        </TouchableOpacity>

        {FILTERS.map(f => (
          <TouchableOpacity key={f.id} style={[styles.filterPill, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
            <f.icon size={14} color={colors.textMuted} />
            <Text style={[styles.filterText, { color: colors.textMuted }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  }
});
