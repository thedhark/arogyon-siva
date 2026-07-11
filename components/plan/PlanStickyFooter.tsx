import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  price: string;
  subtitle?: string;
  onSubscribe: () => void;
}

export default function PlanStickyFooter({ price, subtitle, onSubscribe }: Props) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#121212' : '#FFFFFF',
        borderTopColor: isDark ? '#2A2A2A' : '#F3F4F6',
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20,
      }
    ]}>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
        {subtitle && (
          <Text style={styles.subtitleText}>{subtitle}</Text>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.subscribeBtn} onPress={onSubscribe}>
        <Text style={styles.subscribeText}>Start Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  subscribeBtn: {
    backgroundColor: '#047857', // Darker green to match mockup
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12, // slightly squarer
    elevation: 2,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
