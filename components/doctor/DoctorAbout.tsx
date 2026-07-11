import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import ServiceChip from '@/components/care/ServiceChip';

interface Props {
  doctorData: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorAbout({ doctorData, colors, isDark }: Props) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.aboutText, { color: colors.text }]}>{doctorData.about}</Text>
      <TouchableOpacity style={styles.readMoreBtn}>
        <Text style={styles.readMoreText}>Read more</Text>
        <ArrowLeft size={14} color="#10B981" style={{ transform: [{ rotate: '-90deg' }], marginLeft: 4 }} />
      </TouchableOpacity>

      <View style={styles.servicesHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.servicesGrid}>
        {doctorData.services.map((service: any) => (
          <ServiceChip 
            key={service.id} 
            name={service.name} 
            price={service.price} 
            colors={colors} 
            isDark={isDark} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
