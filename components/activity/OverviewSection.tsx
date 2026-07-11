import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle2, Flame, Star, List } from 'lucide-react-native';

interface Props {
  colors: any;
  isDark: boolean;
}

export default function OverviewSection({ colors, isDark }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
        <TouchableOpacity>
          <List size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.overviewScroll}>
        <View style={[styles.overviewCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.overviewIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
            <CheckCircle2 size={24} color="#8B5CF6" />
          </View>
          <View>
            <Text style={styles.overviewLabel}>Tasks</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>4 / 6</Text>
            <Text style={styles.overviewSub}>Completed</Text>
          </View>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.overviewIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Flame size={24} color="#10B981" />
          </View>
          <View>
            <Text style={styles.overviewLabel}>Streak</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>7</Text>
            <Text style={styles.overviewSub}>Days</Text>
          </View>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.overviewIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Star size={24} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.overviewLabel}>Progress</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>72%</Text>
            <Text style={styles.overviewSub}>This week</Text>
          </View>
        </View>
      </ScrollView>
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
  overviewScroll: {
    paddingHorizontal: 12,
    gap: 16,
  },
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    width: 180,
    gap: 16,
  },
  overviewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  overviewSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
