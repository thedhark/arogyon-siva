import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  filters: any[];
  activeFilter: string;
  setActiveFilter: (id: string) => void;
  colors: any;
  isDark: boolean;
}

export default function CareQuickFilters({ filters, activeFilter, setActiveFilter, colors, isDark }: Props) {
  const router = useRouter();

  return (
    <View style={styles.filtersWrapperContainer}>
      <View style={[styles.filtersWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', shadowColor: isDark ? '#000' : '#9CA3AF' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {filters.map(filter => {
            const isActive = activeFilter === filter.id;
            const Icon = filter.icon;
            return (
              <TouchableOpacity 
                key={filter.id} 
                style={[styles.filterItem, isActive && { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#E6F4EA' }]}
                onPress={() => {
                  setActiveFilter(filter.id);
                  if (filter.route) router.push(filter.route as any);
                }}
              >
                <View style={[
                  styles.filterIconBox, 
                  { backgroundColor: isActive ? 'transparent' : isDark ? '#2A2A2A' : '#F8FAFC' }
                ]}>
                  <Icon size={24} color={isActive ? '#059669' : filter.color} strokeWidth={isActive ? 2.5 : 2} />
                </View>
                <Text style={[
                  styles.filterLabel, 
                  { color: isActive ? '#059669' : colors.textMuted, fontWeight: isActive ? '800' : '600' }
                ]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersWrapperContainer: {
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  filtersWrapper: {
    borderRadius: 24,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  filtersContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 28,
    width: 68,
  },
  filterIconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 11,
  },
});
