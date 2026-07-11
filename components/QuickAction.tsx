import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function QuickAction({ icon, label }: any) {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity style={styles.quickActionItem}>
      <View style={[styles.quickActionIconBg, { backgroundColor: isDark ? '#2A2A2A' : '#fff' }]}>
        {icon}
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.text }]} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  quickActionItem: {
    alignItems: 'center',
    gap: 10,
    width: 70,
  },
  quickActionIconBg: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});
