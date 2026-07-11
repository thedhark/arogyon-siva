import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Stethoscope, Activity, FileText, Apple } from 'lucide-react-native';

const INCLUDES = [
  { id: '1', title: 'Specialist Consults', desc: '4 Video/Audio calls', icon: Stethoscope, color: '#6366F1', bg: '#E0E7FF' },
  { id: '2', title: 'Diet Plans', desc: 'Personalized weekly', icon: Apple, color: '#10B981', bg: '#D1FAE5' },
  { id: '3', title: 'Progress Tracking', desc: 'Daily habit monitor', icon: Activity, color: '#8B5CF6', bg: '#EDE9FE' },
  { id: '4', title: 'Lab Tests', desc: '2 Home collections', icon: FileText, color: '#F59E0B', bg: '#FEF3C7' },
];

export default function PlanIncludesGrid() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>What's Included</Text>
      
      <View style={styles.grid}>
        {INCLUDES.map(item => {
          const Icon = item.icon;
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
              <View style={[styles.iconWrapper, { backgroundColor: isDark ? item.color + '20' : item.bg }]}>
                <Icon size={20} color={item.color} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.desc, { color: colors.textMuted }]}>{item.desc}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
  }
});
