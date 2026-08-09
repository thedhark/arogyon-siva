import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HospitalDetailCard from '@/components/HospitalDetailCard';
import { HOSPITALS_DATA } from '@/constants/directory-data';
import { useTheme } from '@/hooks/useTheme';

export default function DirectoryContent({ activeTab }: { activeTab: string }) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={[styles.countHeader, { color: isDark ? '#9CA3AF' : '#71717A' }]}>
          {`${HOSPITALS_DATA.length} CARE PROVIDERS NEAR YOU`}
        </Text>
        <Text style={[styles.featuredLabel, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
          Featured
        </Text>
      </View>

      {HOSPITALS_DATA.map((hospital, index) => (
        <HospitalDetailCard 
          key={index} 
          {...hospital} 
          speciality={activeTab !== 'Hospitals' ? `${activeTab} Super Speciality Clinic` : hospital.speciality}
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
