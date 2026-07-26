import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export const AnalyticsOverviewCard: React.FC = () => {
  const { colors } = useTheme();
  const { metrics } = usePartnerStore();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Partner Overview & Performance</Text>
        <Text style={styles.subTitle}>Last 30 Days</Text>
      </View>

      <View style={styles.grid}>
        {metrics.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: `${item.accentColor}18` }]}>
                <Ionicons name={item.icon as any} size={18} color={item.accentColor} />
              </View>
              <View style={[styles.changeBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="trending-up" size={12} color="#10B981" />
                <Text style={styles.changeText}>{item.change}</Text>
              </View>
            </View>

            <Text style={[styles.metricValue, { color: colors.text }]}>{item.value}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
});
