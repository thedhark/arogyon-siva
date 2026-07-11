import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Search, Car, FileText } from 'lucide-react-native';

interface HospitalFeaturesProps {
  isDark: boolean;
}

export default function HospitalFeatures({ isDark }: HospitalFeaturesProps) {
  return (
    <View style={styles.featuresGrid}>
      <View style={[styles.featureBox, { borderColor: isDark ? '#333' : '#F3F4F6', backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <ShieldCheck size={24} color="#10B981" />
        <Text style={[styles.featureText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Cashless{'\n'}Insurance</Text>
      </View>
      <View style={[styles.featureBox, { borderColor: isDark ? '#333' : '#F3F4F6', backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Search size={24} color="#4F46E5" />
        <Text style={[styles.featureText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Foreigner{'\n'}Care</Text>
      </View>
      <View style={[styles.featureBox, { borderColor: isDark ? '#333' : '#F3F4F6', backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Car size={24} color="#3B82F6" />
        <Text style={[styles.featureText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Free{'\n'}Parking</Text>
      </View>
      <View style={[styles.featureBox, { borderColor: isDark ? '#333' : '#F3F4F6', backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <FileText size={24} color="#D97706" />
        <Text style={[styles.featureText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Govt.{'\n'}Services</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuresGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 24,
  },
  featureBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
});
