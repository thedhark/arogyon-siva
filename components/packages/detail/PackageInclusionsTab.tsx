import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Stethoscope, TestTube, Activity, BedDouble } from 'lucide-react-native';

interface Props {
  inclusions: string[];
  testsCount?: number;
  isDark: boolean;
  colors: any;
}

export default function PackageInclusionsTab({ inclusions, testsCount, isDark, colors }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'tests' | 'consults' | 'hospital'>('all');

  const categories = [
    { id: 'all', label: 'All Inclusions', icon: Activity, count: inclusions.length },
    { id: 'consults', label: 'Doctor Consults', icon: Stethoscope, count: 2 },
    { id: 'tests', label: 'Lab Diagnostics', icon: TestTube, count: testsCount || inclusions.length },
    { id: 'hospital', label: 'Hospital Stay', icon: BedDouble, count: 3 },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333' : '#EBF0F5',
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: colors.text }]}>What's Included</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{inclusions.length} Care Inclusions</Text>
        </View>
      </View>

      {/* Filter Chips Row */}
      <View style={styles.chipsRow}>
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          const IconComp = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveTab(cat.id as any)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isActive
                  ? { backgroundColor: '#0D9488', borderColor: '#0D9488' }
                  : { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6', borderColor: 'transparent' },
              ]}
            >
              <IconComp size={12} color={isActive ? '#FFFFFF' : colors.textSecondary} />
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563') },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inclusions List */}
      <View style={styles.list}>
        {inclusions.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <CheckCircle2 size={18} color="#10B981" style={styles.checkIcon} />
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{item}</Text>
              <Text style={styles.itemSub}>Includes full report, verified parameters & specialist review</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});
