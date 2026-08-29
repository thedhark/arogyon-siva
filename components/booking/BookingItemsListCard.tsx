import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface Props {
  appointment: Appointment;
}

export default function BookingItemsListCard({ appointment }: Props) {
  const { colors, isDark } = useTheme();

  const doctorName = appointment.doctorName || 'Doctor Specialist';
  const speciality = appointment.speciality || 'Consultant Specialist';
  const fee = Number(appointment.consultationFee || appointment.fee || 800);

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
          borderColor: isDark ? '#27272A' : '#F1F5F9',
        },
      ]}
    >
      <View style={styles.itemRow}>
        <View style={styles.itemDetailsCol}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {doctorName}
          </Text>
          <Text style={styles.itemSubtitle}>
            {speciality} • In-Clinic Consultation
          </Text>
        </View>
        <Text style={[styles.itemPriceText, { color: colors.text }]}>
          ₹{fee.toFixed(2)}
        </Text>
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemDetailsCol: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  itemPriceText: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '700',
  },
});
