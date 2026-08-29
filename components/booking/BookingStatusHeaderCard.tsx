import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

interface Props {
  status: 'upcoming' | 'completed' | 'cancelled';
  confirmationStatus?: string;
  paymentStatus?: string;
}

export default function BookingStatusHeaderCard({
  status,
  confirmationStatus,
  paymentStatus,
}: Props) {
  const { colors, isDark } = useTheme();

  const isCompleted = status === 'completed';
  const isFailed = paymentStatus === 'refunded' || status === 'cancelled';
  const isVisitRequested = confirmationStatus === 'visit_requested';

  let title = 'Order was confirmed';
  let subtitle = 'Specialist doctor allocated at clinic';
  let iconBg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5';
  let iconColor = '#10B981';

  if (isCompleted) {
    title = 'Order was delivered';
    subtitle = 'Consultation successfully completed';
    iconBg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5';
    iconColor = '#10B981';
  } else if (isFailed) {
    title = 'Payment / Booking Cancelled';
    subtitle = 'Amount refunded to source account';
    iconBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2';
    iconColor = '#EF4444';
  } else if (isVisitRequested) {
    title = 'Visit Requested';
    subtitle = 'Awaiting hospital care desk verification';
    iconBg = isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7';
    iconColor = '#D97706';
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isDark ? '#27272A' : '#F1F5F9',
        },
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        {isFailed ? (
          <AlertCircle size={22} color={iconColor} />
        ) : isVisitRequested ? (
          <Clock size={22} color={iconColor} />
        ) : (
          <CheckCircle2 size={22} color={iconColor} />
        )}
      </View>

      <View style={styles.textCol}>
        <Text style={[styles.statusTitle, { color: colors.text }]}>{title}</Text>
        <Text style={styles.statusSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statusSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
