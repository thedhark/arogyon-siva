import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Globe, Clock } from 'lucide-react-native';

interface Props {
  doctorData: any;
  isDark: boolean;
}

export default function DoctorStats({ doctorData, isDark }: Props) {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <MapPin size={18} color="#10B981" />
            </View>
            <Text style={styles.statLabel} numberOfLines={1}>{doctorData.location.split(',')[0]}</Text>
            <Text style={styles.statSublabel}>{doctorData.distance}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Globe size={18} color="#3B82F6" />
            </View>
            <Text style={styles.statLabel} numberOfLines={1}>{doctorData.languages.split(',')[0]}</Text>
            <Text style={styles.statSublabel}>Languages</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={18} color="#D97706" />
            </View>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={styles.statSublabel}>Today</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'center',
  },
  statSublabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
});

