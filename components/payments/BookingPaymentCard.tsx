import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CreditCard, Smartphone, Wallet, FileText, CheckCircle2, RotateCcw, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Appointment } from '@/hooks/useBookingStore';
import { formatDisplayDate } from '@/utils';

interface BookingPaymentCardProps {
  appointment: Appointment;
  onViewInvoice: (appointment: Appointment) => void;
}

export default function BookingPaymentCard({ appointment, onViewInvoice }: BookingPaymentCardProps) {
  const { colors, isDark } = useTheme();

  const isRefunded = appointment.paymentStatus === 'refunded' || appointment.status === 'cancelled';
  const totalAmount = appointment.totalPaid || parseFloat(appointment.fee) || 699;

  const getMethodIcon = (method?: string) => {
    if (!method) return <CreditCard size={16} color={colors.textSecondary} />;
    if (method.includes('UPI') || method.includes('Pay') || method.includes('PhonePe')) {
      return <Smartphone size={16} color="#10B981" />;
    }
    if (method.includes('Wallet')) {
      return <Wallet size={16} color="#3B82F6" />;
    }
    return <CreditCard size={16} color="#8B5CF6" />;
  };

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', 
          borderColor: isDark ? '#333333' : '#F0F0F0' 
        }
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.doctorInfo}>
          {appointment.image ? (
            <Image source={{ uri: appointment.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent + '20' }]}>
              <Text style={{ color: colors.accent, fontWeight: '700' }}>{appointment.doctorName[0]}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.doctorName, { color: colors.text }]} numberOfLines={1}>
              {appointment.doctorName}
            </Text>
            <Text style={[styles.hospitalName, { color: colors.textSecondary }]} numberOfLines={1}>
              {appointment.hospitalName} • {appointment.speciality}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[
          styles.statusBadge, 
          { backgroundColor: isRefunded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }
        ]}>
          {isRefunded ? (
            <>
              <RotateCcw size={12} color="#EF4444" />
              <Text style={[styles.statusText, { color: '#EF4444' }]}>Refunded</Text>
            </>
          ) : (
            <>
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={[styles.statusText, { color: '#10B981' }]}>Paid</Text>
            </>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]} />

      {/* Payment Meta Info */}
      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Payment Method</Text>
          <View style={styles.methodWrap}>
            {getMethodIcon(appointment.paymentMethod)}
            <Text style={[styles.methodText, { color: colors.text }]}>
              {appointment.paymentMethod || 'UPI Instant'}
            </Text>
          </View>
        </View>

        <View style={styles.metaColRight}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Date & Time</Text>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {appointment.date} • {appointment.time}
          </Text>
        </View>
      </View>

      {/* Footer Row */}
      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.paymentIdText, { color: colors.textMuted }]}>
            Ref: {appointment.paymentId || 'PAY-RZP-984210'}
          </Text>
          <Text style={[styles.amountText, { color: isRefunded ? colors.textMuted : colors.text }]}>
            ₹{totalAmount}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.invoiceBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(16, 185, 129, 0.08)' }]}
          onPress={() => onViewInvoice(appointment)}
          activeOpacity={0.7}
        >
          <FileText size={15} color="#10B981" />
          <Text style={styles.invoiceBtnText}>View Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  hospitalName: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaCol: {
    gap: 4,
  },
  metaColRight: {
    gap: 4,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  methodWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  paymentIdText: {
    fontSize: 11,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 1,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  invoiceBtnText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
});
