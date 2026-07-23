import React from 'react';
import { View, StyleSheet } from 'react-native';
import HospitalDetailCard from '@/components/HospitalDetailCard';
import { HOSPITALS_DATA } from '@/constants/directory-data';

export default function DirectoryContent({ activeTab }: { activeTab: string }) {
  return (
    <View style={styles.container}>
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
    gap: 20,
    minHeight: 600, // Ensure it fills the screen so sticky header works
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
