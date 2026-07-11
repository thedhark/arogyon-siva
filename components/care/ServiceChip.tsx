import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  price: string;
  colors: any;
  isDark: boolean;
}

export default function ServiceChip({ name, price, colors, isDark }: Props) {
  return (
    <View style={[styles.chip, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{name}</Text>
      <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    width: '48%', 
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 12,
    fontWeight: '800',
  }
});
