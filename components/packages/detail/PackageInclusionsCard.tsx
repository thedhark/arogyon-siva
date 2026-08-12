import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, ChevronDown, ChevronUp, ListCheck } from 'lucide-react-native';

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
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  
  const displayList = inclusions.length > 0 ? inclusions : DEFAULT_INCLUSIONS;
  const initialLimit = 3;
  const visibleList = showAllItems ? displayList : displayList.slice(0, initialLimit);
  const hasMore = displayList.length > initialLimit;

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
          <ListCheck size={18} color={isDark ? '#A78BFA' : '#6527BE'} />
          <Text style={[styles.title, { color: colors.text }]}>What's included</Text>
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
          <View style={styles.list}>
            {visibleList.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <View style={[styles.checkWrapper, { backgroundColor: isDark ? '#2E1065' : '#F5F3FF' }]}>
                  <Check size={15} color={isDark ? '#DDD6FE' : '#6527BE'} strokeWidth={2.8} />
                </View>
                <Text style={[styles.itemText, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {hasMore && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowAllItems(!showAllItems)}
              style={styles.viewMoreBtn}
            >
              <Text style={[styles.viewMoreText, { color: isDark ? '#A78BFA' : '#6527BE' }]}>
                {showAllItems ? 'Show less services' : `View all ${displayList.length} services`}
              </Text>
            </TouchableOpacity>
          )}
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
