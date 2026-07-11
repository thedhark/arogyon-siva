import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface Props {
  doctorData: any;
  isDark: boolean;
}

export default function DoctorStats({ doctorData, isDark }: Props) {
  return (
    <View style={styles.profileCardWrapper}>
      <View style={[styles.profileCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
        <View style={[styles.statsRow, { borderTopColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={styles.statItem}>
            <MapPin size={16} color="#6B7280" style={{ marginBottom: 4 }} />
            <Text style={styles.statLabel}>{doctorData.location}</Text>
            <Text style={styles.statValue}>{doctorData.distance}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconPlaceholder}><Text>💼</Text></View>
            <Text style={styles.statLabel}>{doctorData.experience.split(' ')[0]}</Text>
            <Text style={styles.statValue}>Experience</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconPlaceholder}><Text>👥</Text></View>
            <Text style={styles.statLabel}>{doctorData.patients}</Text>
            <Text style={styles.statValue}>Patients</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconPlaceholder}><Text>🗣️</Text></View>
            <Text style={styles.statLabel}>{doctorData.languages.split(',')[0]}</Text>
            <Text style={styles.statValue}>Languages</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCardWrapper: {
    paddingHorizontal: 16,
    zIndex: 2,
  },
  profileCard: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    paddingTop: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    width: '24%',
  },
  statIconPlaceholder: {
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
