import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Info } from 'lucide-react-native';

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
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
      ]}
    >
      {/* Accordion Header */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsAccordionOpen(!isAccordionOpen)}
        style={styles.headerRow}
      >
        <View style={styles.titleWithIcon}>
          <Info size={18} color={isDark ? '#A78BFA' : '#6527BE'} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        {isAccordionOpen ? (
          <ChevronUp size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        ) : (
          <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        )}
      </TouchableOpacity>

      {/* Accordion Content */}
      {isAccordionOpen && (
        <View style={styles.contentBody}>
          <Text style={[styles.description, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>
            {description}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    // Flat style with NO shadows/elevation per user requirement
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  contentBody: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  description: {
    fontSize: 13.5,
    lineHeight: 21,
  },
});
