import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title?: string;
  description?: string;
  isDark: boolean;
  colors: any;
}

export default function PackageAboutCard({
  title = 'About this plan',
  description = 'A complete pregnancy care plan that covers preconception to postpartum. Personalized care for you and your baby with expert guidance at every step.',
  isDark,
  colors,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#2E2E2E' : '#F1F5F9',
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
});
