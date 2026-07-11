import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, Activity, Scissors, Bone, FileText, Car } from 'lucide-react-native';

interface HospitalServicesProps {
  isDark: boolean;
  colors: any;
}

const SERVICES_DATA = [
  { name: '24/7 Emergency', icon: HeartPulse, color: '#EF4444' },
  { name: 'ICU & NICU', icon: Activity, color: '#3B82F6' },
  { name: 'Operation Theatres', icon: Scissors, color: '#8B5CF6' },
  { name: 'Radiology (X-Ray/MRI)', icon: Bone, color: '#D97706' },
  { name: 'Pharmacy', icon: FileText, color: '#10B981' },
  { name: 'Ambulance', icon: Car, color: '#F59E0B' }
];

export default function HospitalServices({ isDark, colors }: HospitalServicesProps) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Hospital Services</Text>
      <View style={styles.gridContainer}>
        {SERVICES_DATA.map((service, idx) => (
          <View key={idx} style={styles.serviceItem}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
              <service.icon color={service.color} size={28} />
            </View>
            <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
