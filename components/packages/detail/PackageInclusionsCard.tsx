import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface Props {
  inclusions?: string[];
  isDark: boolean;
  colors: any;
}

const DEFAULT_INCLUSIONS = [
  'Obstetrician Consultations',
  'All Lab Tests & Scans',
  'Nutrition & Diet Guidance',
  'Physiotherapy & Yoga',
  'Delivery & Hospitalization',
  'Postpartum & Lactation Support',
];

export default function PackageInclusionsCard({
  inclusions = DEFAULT_INCLUSIONS,
  isDark,
  colors,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const displayList = inclusions.length > 0 ? inclusions : DEFAULT_INCLUSIONS;
  const visibleList = expanded ? displayList : displayList.slice(0, 6);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: 'transparent',
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>What's included</Text>

      <View style={styles.list}>
        {visibleList.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <View style={styles.checkWrapper}>
              <Check size={16} color="#6527BE" strokeWidth={2.8} />
            </View>
            <Text style={[styles.itemText, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      {displayList.length > 6 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.viewMoreBtn}
        >
          <Text style={styles.viewMoreText}>
            {expanded ? 'Show less services' : 'View all services'}
          </Text>
        </TouchableOpacity>
      )}

      {displayList.length <= 6 && (
        <TouchableOpacity activeOpacity={0.7} style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>View all services</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  viewMoreBtn: {
    marginTop: 18,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    color: '#6527BE',
    fontSize: 15,
    fontWeight: '700',
  },
});
