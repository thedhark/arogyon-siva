import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse } from 'lucide-react-native';
import HospitalFeatures from '@/components/HospitalFeatures';
import HospitalServices from '@/components/HospitalServices';

interface Props {
  colors: any;
  isDark: boolean;
}

export default function HospitalOverview({ colors, isDark }: Props) {
  return (
    <View style={styles.tabContent}>
      <View style={{ marginBottom: 24, marginHorizontal: -12 }}>
        <HospitalFeatures isDark={isDark} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>About Hospital</Text>
      <Text style={styles.aboutText}>
        Max Super Speciality Hospital is a multi-speciality quaternary care hospital with advanced technology and expert medical professionals.
        <Text style={styles.readMore}> ... Read more</Text>
      </Text>

      <View style={{ marginTop: 32, marginHorizontal: -12 }}>
        <HospitalServices isDark={isDark} colors={colors} />
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
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  emergencyText: {
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  aboutText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  readMore: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});
