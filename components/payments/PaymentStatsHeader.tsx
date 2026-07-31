import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Award } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface PaymentStatsHeaderProps {
  totalSpent: number;
  totalSavings: number;
  paidCount: number;
}

export default function PaymentStatsHeader({ totalSpent, totalSavings, paidCount }: PaymentStatsHeaderProps) {
  const { colors, isDark } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E293B' : '#0F766E' }]}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <ShieldCheck size={14} color="#5EEAD4" />
          <Text style={styles.badgeText}>Verified Payments</Text>
        </View>
        <View style={styles.savedPill}>
          <Award size={12} color="#FDE047" />
          <Text style={styles.savedText}>Saved {formatCurrency(totalSavings)}</Text>
        </View>
      </View>

      <Text style={styles.label}>Total Healthcare Spend</Text>
      <Text style={styles.amount}>{formatCurrency(totalSpent)}</Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{paidCount}</Text>
          <Text style={styles.statLabel}>Completed Bookings</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Instant Refund Protection</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#5EEAD4',
    fontSize: 12,
    fontWeight: '600',
  },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253, 224, 71, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savedText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  statBox: {
    flex: 1,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
});
