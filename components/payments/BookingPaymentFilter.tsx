import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type PaymentFilterType = 'all' | 'paid' | 'refunded' | 'upcoming';

interface BookingPaymentFilterProps {
  activeFilter: PaymentFilterType;
  onSelectFilter: (filter: PaymentFilterType) => void;
  counts: Record<PaymentFilterType, number>;
}

const FILTERS: { id: PaymentFilterType; label: string }[] = [
  { id: 'all', label: 'All Payments' },
  { id: 'paid', label: 'Successful' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'refunded', label: 'Refunds' },
];

export default function BookingPaymentFilter({ activeFilter, onSelectFilter, counts }: BookingPaymentFilterProps) {
  const { colors, isDark } = useTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.id;
        const count = counts[f.id] || 0;

        return (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.chip,
              {
                backgroundColor: isActive 
                  ? colors.accent 
                  : (isDark ? '#1E1E1E' : '#FFFFFF'),
                borderColor: isActive 
                  ? colors.accent 
                  : (isDark ? '#333333' : '#E5E7EB'),
              }
            ]}
            onPress={() => onSelectFilter(f.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? '#FFFFFF' : colors.text,
                  fontWeight: isActive ? '700' : '500',
                }
              ]}
            >
              {f.label} ({count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
  },
});
