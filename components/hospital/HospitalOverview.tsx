import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  colors: any;
}

export default function HospitalOverview({ colors }: Props) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>About Hospital</Text>
      <Text style={styles.aboutText}>
        Max Super Speciality Hospital is a multi-speciality quaternary care hospital with advanced technology and expert medical professionals.
        <Text style={styles.readMore}> ... Read more</Text>
      </Text>
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
