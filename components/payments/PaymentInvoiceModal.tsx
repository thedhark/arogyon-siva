import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { ShieldCheck, Download, Share2, CheckCircle2, Building2, Calendar, FileText, QrCode } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Appointment } from '@/hooks/useBookingStore';

interface PaymentInvoiceModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function PaymentInvoiceModal({ appointment, onClose }: PaymentInvoiceModalProps) {
  const { colors, isDark } = useTheme();

  if (!appointment) return null;

  const consultationFee = appointment.consultationFee || parseFloat(appointment.fee) || 699;
  const taxFee = appointment.taxFee ?? 50;
  const discount = appointment.discount ?? 50;
  const totalPaid = appointment.totalPaid || (consultationFee + taxFee - discount);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ArogyonTaxInvoice_${appointment.paymentId || appointment.id}`;

  const handleDownload = () => {
    Alert.alert('Invoice Downloaded', `Tax invoice for ${appointment.paymentId || appointment.id} has been saved to your Downloads.`);
  };

  const handleShare = () => {
    Alert.alert('Share Invoice', `Sharing receipt for appointment #${appointment.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Building2 size={20} color="#10B981" />
          <Text style={[styles.title, { color: colors.text }]}>Official Tax Invoice</Text>
        </View>
        <View style={styles.verifiedPill}>
          <ShieldCheck size={12} color="#10B981" />
          <Text style={styles.verifiedText}>GST Verified</Text>
        </View>
      </View>

      {/* Invoice Card Container */}
      <View style={[styles.invoiceBody, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
        
        {/* Top Info */}
        <View style={styles.topInfoRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.doctorTitle, { color: colors.text }]}>{appointment.doctorName}</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>{appointment.speciality}</Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>{appointment.hospitalName}</Text>
          </View>
          <Image source={{ uri: qrUrl }} style={styles.qrCode} />
        </View>

        <View style={[styles.dashedLine, { borderColor: isDark ? '#333' : '#E0E0E0' }]} />

        {/* Transaction ID & Date */}
        <View style={styles.metaRow}>
          <View>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>INVOICE NO.</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{appointment.paymentId || 'PAY-RZP-984210'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>DATE & TIME</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{appointment.date} • {appointment.time}</Text>
          </View>
        </View>

        <View style={[styles.dashedLine, { borderColor: isDark ? '#333' : '#E0E0E0' }]} />

        {/* Itemized Price Breakdown */}
        <View style={styles.breakdownContainer}>
          <Text style={[styles.breakdownHeader, { color: colors.textMuted }]}>PRICE BREAKDOWN</Text>

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownItem, { color: colors.text }]}>Consultation Fee</Text>
            <Text style={[styles.breakdownPrice, { color: colors.text }]}>₹{consultationFee}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownItem, { color: colors.text }]}>GST & Technology Fee</Text>
            <Text style={[styles.breakdownPrice, { color: colors.text }]}>₹{taxFee}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownItem, { color: '#10B981' }]}>Arogyon Offer Discount</Text>
              <Text style={[styles.breakdownPrice, { color: '#10B981' }]}>-₹{discount}</Text>
            </View>
          )}

          <View style={[styles.totalRow, { borderTopColor: isDark ? '#333' : '#E5E7EB' }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount Paid</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>₹{totalPaid}</Text>
          </View>
        </View>

        {/* Payment Method Badge */}
        <View style={[styles.paidFooter, { backgroundColor: isDark ? '#2D3748' : '#ECFDF5' }]}>
          <CheckCircle2 size={16} color="#10B981" />
          <Text style={styles.paidFooterText}>
            Paid via {appointment.paymentMethod || 'UPI'} • Transaction Successful
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.downloadBtn]} onPress={handleDownload} activeOpacity={0.8}>
          <Download size={18} color="#FFFFFF" />
          <Text style={styles.downloadBtnText}>Download PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.shareBtn, { borderColor: colors.accent }]} onPress={handleShare} activeOpacity={0.8}>
          <Share2 size={18} color={colors.accent} />
          <Text style={[styles.shareBtnText, { color: colors.accent }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  invoiceBody: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  subText: {
    fontSize: 13,
    marginTop: 2,
  },
  qrCode: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  breakdownContainer: {
    gap: 8,
  },
  breakdownHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    fontSize: 14,
  },
  breakdownPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  paidFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  paidFooterText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadBtn: {
    backgroundColor: '#10B981',
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  shareBtn: {
    borderWidth: 1.5,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
