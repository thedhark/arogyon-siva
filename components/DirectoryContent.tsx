import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HospitalDetailCard from '@/components/HospitalDetailCard';
import { HOSPITALS_DATA } from '@/constants/directory-data';
import { useTheme } from '@/hooks/useTheme';

export default function DirectoryContent({ activeTab }: { activeTab: string }) {
  const { colors, isDark } = useTheme();

  const filteredData = React.useMemo(() => {
    if (!activeTab || activeTab === 'Hospitals' || activeTab === 'All') {
      return HOSPITALS_DATA;
    }
    const tabLower = activeTab.toLowerCase();
    const matches = HOSPITALS_DATA.filter(h => {
      const specLower = (h.speciality || '').toLowerCase();
      const nameLower = (h.name || '').toLowerCase();
      const categoryLower = ((h as any).category || '').toLowerCase();
      const deptsLower = (h.departments || '').toLowerCase();
      
      return specLower.includes(tabLower) || 
             nameLower.includes(tabLower) || 
             categoryLower.includes(tabLower) || 
             deptsLower.includes(tabLower);
    });

    if (matches.length === 0) {
      return HOSPITALS_DATA;
    }
    return matches;
  }, [activeTab]);

  const headerTitle = React.useMemo(() => {
    if (!activeTab || activeTab === 'Hospitals' || activeTab === 'All') {
      return `${filteredData.length} CARE PROVIDERS NEAR YOU`;
    }
    return `${filteredData.length} ${activeTab.toUpperCase()} PROVIDERS NEAR YOU`;
  }, [activeTab, filteredData.length]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={[styles.countHeader, { color: isDark ? '#9CA3AF' : '#71717A' }]}>
          {headerTitle}
        </Text>
        <Text style={[styles.featuredLabel, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
          Featured
        </Text>
      </View>

      {filteredData.map((hospital, index) => (
        <HospitalDetailCard 
          key={hospital.id || hospital.name + '-' + index} 
          {...hospital} 
          speciality={hospital.speciality}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 80,
    gap: 12,
    minHeight: 600,
  },
  headerBlock: {
    marginBottom: 4,
    gap: 4,
  },
  countHeader: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  featuredLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  }
});

