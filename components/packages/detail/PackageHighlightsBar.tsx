import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, TestTube, FileText, Users } from 'lucide-react-native';

interface Props {
  fasting?: string;
  sampleType?: string;
  reportTime?: string;
  ageGroup?: string;
  isDark: boolean;
  colors: any;
}

export default function PackageHighlightsBar({
  fasting = '10-12 Hrs Fasting',
  sampleType = 'Home Pickup / Hospital Visit',
  reportTime = 'Reports in 24 Hours',
  ageGroup = 'Suitable for 18+ Yrs',
  isDark,
  colors,
}: Props) {
  const highlights = [
    { icon: Clock, label: 'Fasting Needed', value: fasting, color: '#F59E0B' },
    { icon: TestTube, label: 'Sample / Visit', value: sampleType, color: '#6366F1' },
    { icon: FileText, label: 'Report Delivery', value: reportTime, color: '#10B981' },
    { icon: Users, label: 'Age Guidance', value: ageGroup, color: '#EC4899' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333' : '#EBF0F5',
        },
      ]}
    >
      <View style={styles.grid}>
        {highlights.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <View key={idx} style={styles.gridItem}>
              <View style={[styles.iconBg, { backgroundColor: item.color + '15' }]}>
                <IconComp size={16} color={item.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
  },
  gridItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
});
