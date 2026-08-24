import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HospitalDetailCard from '@/components/HospitalDetailCard';
import TrustedDoctorsSection from '@/components/home/TrustedDoctorsSection';
import { HOSPITALS_DATA } from '@/constants/directory-data';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function DirectoryContent({ activeTab }: { activeTab: string }) {
  const { colors, isDark } = useTheme();

  const filteredData = React.useMemo(() => {
    if (!activeTab || activeTab === 'All') {
      return HOSPITALS_DATA;
    }
    const tabLower = activeTab.toLowerCase();
    const matches = HOSPITALS_DATA.filter(h => {
      const categoryLower = ((h as any).category || '').toLowerCase();
      const specLower = (h.speciality || '').toLowerCase();
      const nameLower = (h.name || '').toLowerCase();
      const deptsLower = (h.departments || '').toLowerCase();
      
      return categoryLower === tabLower ||
             categoryLower.includes(tabLower) ||
             specLower.includes(tabLower) || 
             nameLower.includes(tabLower) || 
             deptsLower.includes(tabLower);
    });

    return matches;
  }, [activeTab]);

  const headerTitle = React.useMemo(() => {
    if (!activeTab || activeTab === 'All') {
      return `${filteredData.length} TOP CARE PROVIDERS NEAR YOU`;
    }
    return `${filteredData.length} ${activeTab.toUpperCase()} SPECIALISTS & CLINICS`;
  }, [activeTab, filteredData.length]);

  return (
    <Animated.View key={activeTab} entering={FadeIn.duration(220)} style={styles.container}>
      {/* Most Trusted Doctors Section (Only for specific categories, hidden on 'All') */}
      {activeTab && activeTab !== 'All' && (
        <View style={styles.doctorsSectionWrapper}>
          <TrustedDoctorsSection activeTab={activeTab} />
        </View>
      )}

      <View style={styles.headerBlock}>
        <Text style={[styles.countHeader, { color: isDark ? '#9CA3AF' : '#71717A' }]}>
          {headerTitle}
        </Text>
        <Text style={[styles.featuredLabel, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
          Verified & Partnered
        </Text>
      </View>

      {filteredData.length > 0 ? (
        filteredData.map((hospital, index) => (
          <HospitalDetailCard 
            key={hospital.id || hospital.name + '-' + index} 
            {...hospital} 
            speciality={hospital.speciality}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            No centers found for {activeTab}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 80,
    gap: 12,
    minHeight: 600,
  },
  doctorsSectionWrapper: {
    marginHorizontal: -12,
    marginBottom: 6,
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

