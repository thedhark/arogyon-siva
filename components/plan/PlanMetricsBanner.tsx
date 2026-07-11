import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function PlanMetricsBanner() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : 'transparent' }]}>
        
        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, { color: colors.text }]}>45</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Days</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, { color: colors.text }]}>5</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Phases</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, { color: colors.text }]}>24/7</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Support</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, { color: colors.text }]}>12K+</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Joined</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -50, // Negative margin to overlap the hero image
    marginBottom: 32,
    zIndex: 10, // Ensure it sits above the image
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 36,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  }
});
