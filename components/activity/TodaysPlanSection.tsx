import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Footprints, Pill, Flower2, Droplet, CheckCircle2, Circle } from 'lucide-react-native';

interface Props {
  colors: any;
  isDark: boolean;
}

export default function TodaysPlanSection({ colors, isDark }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's plan</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.planList}>
        
        <View style={[styles.planCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.planIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Footprints size={24} color="#10B981" />
          </View>
          <View style={styles.planContent}>
            <Text style={[styles.planTitle, { color: colors.text }]}>Walk 5,000 steps</Text>
            <Text style={styles.planSubtitle}>Daily goal</Text>
          </View>
          <CheckCircle2 size={24} color="#10B981" />
        </View>

        <View style={[styles.planCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.planIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
            <Pill size={24} color="#8B5CF6" />
          </View>
          <View style={styles.planContent}>
            <Text style={[styles.planTitle, { color: colors.text }]}>Take medicine</Text>
            <Text style={styles.planSubtitle}>After breakfast • 9:00 AM</Text>
          </View>
          <Circle size={24} color="#8B5CF6" />
        </View>

        <View style={[styles.planCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.planIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Flower2 size={24} color="#F59E0B" />
          </View>
          <View style={styles.planContent}>
            <Text style={[styles.planTitle, { color: colors.text }]}>10 min meditation</Text>
            <Text style={styles.planSubtitle}>Mind & relaxation</Text>
          </View>
          <Circle size={24} color="#8B5CF6" />
        </View>

        <View style={[styles.planCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.planIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Droplet size={24} color="#3B82F6" />
          </View>
          <View style={styles.planContent}>
            <Text style={[styles.planTitle, { color: colors.text }]}>Drink 2L water</Text>
            <Text style={styles.planSubtitle}>Stay hydrated</Text>
          </View>
          <CheckCircle2 size={24} color="#10B981" />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  planList: {
    paddingHorizontal: 12,
    gap: 12,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  planIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
