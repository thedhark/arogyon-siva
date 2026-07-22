import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, Activity, Scissors, Bone, FileText, Car, ShieldCheck, Search, Building, Clock } from 'lucide-react-native';

interface Props {
  colors: any;
  isDark: boolean;
}

const ALL_SERVICES_DATA = [
  { name: '24/7 Emergency', icon: HeartPulse, color: '#EF4444' },
  { name: 'Cashless Insurance', icon: ShieldCheck, color: '#10B981' },
  { name: 'Foreigner Care', icon: Search, color: '#4F46E5' },
  { name: 'ICU & NICU', icon: Activity, color: '#3B82F6' },
  { name: 'Operation Theatres', icon: Scissors, color: '#8B5CF6' },
  { name: 'Radiology (X-Ray/MRI)', icon: Bone, color: '#D97706' },
  { name: 'Free Parking', icon: Car, color: '#3B82F6' },
  { name: 'Govt. Services', icon: FileText, color: '#D97706' },
  { name: 'Pharmacy', icon: Building, color: '#059669' },
  { name: '24x7 Ambulance', icon: Clock, color: '#DC2626' }
];

export default function HospitalOverview({ colors, isDark }: Props) {
  return (
    <View style={styles.tabContent}>
      {/* 1. About Hospital Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About Hospital</Text>
        <Text style={[styles.aboutText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
          Max Super Speciality Hospital is a premier multi-speciality quaternary care healthcare institute. 
          Equipped with 500+ beds, advanced 3D robotic surgical systems, state-of-the-art ICUs, and top super-specialist doctors, 
          it provides world-class compassionate medical care 24/7.
          <Text style={styles.readMore}> ... Read more</Text>
        </Text>
      </View>

      {/* 2. Hospital Services & Facilities Section */}
      <View style={[styles.sectionContainer, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Services & Facilities</Text>
        <View style={styles.gridContainer}>
          {ALL_SERVICES_DATA.map((service, idx) => (
            <View key={idx} style={styles.serviceItem}>
              <View style={[
                styles.iconBox, 
                { 
                  backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', 
                  borderColor: isDark ? '#2C2C2E' : '#F3F4F6' 
                }
              ]}>
                <service.icon color={service.color} size={24} />
              </View>
              <Text style={[styles.serviceName, { color: colors.text }]} numberOfLines={2}>
                {service.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});

