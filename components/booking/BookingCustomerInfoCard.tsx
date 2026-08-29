import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CreditCard, Calendar, MapPin, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';

interface Props {
  appointment: Appointment;
}

export default function BookingCustomerInfoCard({ appointment }: Props) {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);

  const patientName =
    appointment.assignedPatientName || userProfile?.name || 'Kandala Sridhar';
  const phone = userProfile?.phone || '955071XXXX';
  const paymentMethod = appointment.paymentMethod || 'Paid via: UPI';
  const paymentDate = 'August 25, 2026 at 8:30 PM';
  const address =
    appointment.location ||
    '402 primark lake view , Mangalam, Tirupati';

  const initials = patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isDark ? '#2D2D36' : '#F1F5F9',
        },
      ]}
    >
      {/* Patient Avatar & Name Header */}
      <View style={styles.patientRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials || 'KS'}</Text>
        </View>
        <View style={styles.patientInfoCol}>
          <Text style={[styles.patientName, { color: colors.text }]}>{patientName}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A34' : '#F8FAFC' }]} />

      {/* Payment Method */}
      <View style={styles.detailRow}>
        <CreditCard size={18} color="#64748B" style={styles.icon} />
        <View style={styles.detailTextCol}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Payment method</Text>
          <Text style={styles.detailSubtitle}>{paymentMethod}</Text>
        </View>
      </View>

      {/* Payment Date */}
      <View style={styles.detailRow}>
        <Calendar size={18} color="#64748B" style={styles.icon} />
        <View style={styles.detailTextCol}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Payment date</Text>
          <Text style={styles.detailSubtitle}>{paymentDate}</Text>
        </View>
      </View>

      {/* Delivery / Visit Address */}
      <View style={styles.detailRow}>
        <MapPin size={18} color="#64748B" style={styles.icon} />
        <View style={styles.detailTextCol}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Delivery address</Text>
          <Text style={styles.detailSubtitle}>{address}</Text>
        </View>
      </View>

      {/* Accreditation Footer */}
      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A34' : '#F8FAFC' }]} />
      <View style={styles.licenseRow}>
        <ShieldCheck size={16} color="#10B981" />
        <Text style={styles.licenseText}>Lic. No. 10125026000251</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  patientInfoCol: {
    flex: 1,
  },
  patientName: {
    fontFamily: Fonts.bold,
    fontSize: 15.5,
    fontWeight: '700',
  },
  phoneText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  icon: {
    marginTop: 2,
  },
  detailTextCol: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  detailSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 18,
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  licenseText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
});
