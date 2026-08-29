import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FileText, Download } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface Props {
  appointment: Appointment;
  onInvoicePress?: () => void;
}

export default function BookingBillSummaryCard({
  appointment,
  onInvoicePress,
}: Props) {
  const { colors, isDark } = useTheme();

  const itemTotal = Number(appointment.consultationFee || appointment.fee || 800);
  const tax = Number(appointment.taxFee || 40);
  const platformFee = 15;
  const discount = Number(appointment.discount || 55);
  const grandTotal = Number(appointment.totalPaid || itemTotal + tax + platformFee - discount);

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
      {/* Header with Title + Download Icon */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
            <FileText size={18} color={isDark ? '#CBD5E1' : '#475569'} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Bill Summary</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.downloadIconBtn,
            { borderColor: isDark ? '#3F3F46' : '#FEE2E2', backgroundColor: isDark ? '#27272A' : '#FEF2F2' },
          ]}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onInvoicePress?.();
          }}
          activeOpacity={0.7}
        >
          <Download size={16} color="#E11D48" />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A34' : '#F8FAFC' }]} />

      {/* Bill Calculation Rows */}
      <View style={styles.billRowsContainer}>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Item total</Text>
          <Text style={[styles.calcValue, { color: colors.text }]}>₹{itemTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>GST (govt. taxes)</Text>
          <Text style={[styles.calcValue, { color: colors.text }]}>₹{tax.toFixed(2)}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Delivery / Consultation partner fee</Text>
          <View style={styles.freeWrap}>
            <Text style={styles.strikethroughText}>₹25.00</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Platform fee</Text>
          <Text style={[styles.calcValue, { color: colors.text }]}>₹{platformFee.toFixed(2)}</Text>
        </View>

        <View style={[styles.innerDivider, { backgroundColor: isDark ? '#2A2A34' : '#F1F5F9' }]} />

        <View style={styles.calcRow}>
          <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Grand total</Text>
          <Text style={[styles.grandTotalValue, { color: colors.text }]}>
            ₹{(itemTotal + tax + platformFee).toFixed(2)}
          </Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.couponLabel}>Coupon applied - TASTY</Text>
          <Text style={styles.couponValue}>- ₹{discount.toFixed(2)}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Cash round off</Text>
          <Text style={[styles.calcValue, { color: colors.text }]}>- ₹0.00</Text>
        </View>

        <View style={[styles.innerDivider, { backgroundColor: isDark ? '#2A2A34' : '#F1F5F9' }]} />

        {/* Final Paid Row */}
        <View style={styles.paidRow}>
          <Text style={[styles.paidLabel, { color: colors.text }]}>Paid</Text>
          <Text style={[styles.paidValue, { color: colors.text }]}>₹{grandTotal.toFixed(2)}</Text>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
  },
  downloadIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  innerDivider: {
    height: 1,
    marginVertical: 8,
  },
  billRowsContainer: {
    gap: 8,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#64748B',
  },
  calcValue: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  freeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strikethroughText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  freeText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  grandTotalLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  grandTotalValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  couponLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  couponValue: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
  paidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  paidLabel: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '800',
  },
  paidValue: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '800',
  },
});
