import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { X, Download, Share2, CheckCircle2, ShieldCheck, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface BookingInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  booking: Appointment;
}

export default function BookingInvoiceModal({
  visible,
  onClose,
  booking,
}: BookingInvoiceModalProps) {
  const { colors, isDark } = useTheme();

  if (!booking) return null;

  const invoiceNumber = `INV-${booking.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = booking.date || '25 Aug 2026';
  const itemTotal = Number(booking.consultationFee || booking.fee || 800);
  const tax = Number(booking.taxFee || 40);
  const platformFee = 15;
  const discount = Number(booking.discount || 55);
  const grandTotal = Number(booking.totalPaid || itemTotal + tax + platformFee - discount);

  const handleShare = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await Share.share({
        message: `Medical Receipt #${invoiceNumber} for ${booking.doctorName} at ${booking.hospitalName}. Total Paid: ₹${grandTotal}. Downloaded from Arogyon Premium.`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? '#162038' : '#FFFFFF',
              borderColor: isDark ? '#233252' : '#E0ECF8',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <FileText size={20} color="#4F46E5" />
              <Text style={[styles.title, { color: colors.text }]}>Tax Invoice / Receipt</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={isDark ? '#CBD5E1' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Invoice Meta Box */}
            <View
              style={[
                styles.invoiceBox,
                {
                  backgroundColor: isDark ? '#1E293B' : '#EDF4FC',
                  borderColor: isDark ? '#334155' : '#D5E5F7',
                },
              ]}
            >
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{invoiceNumber}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice Date:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{dateStr}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Hospital / Clinic:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{booking.hospitalName}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Patient Name:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{booking.assignedPatientName || 'Kandala Sridhar'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Payment Method:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{booking.paymentMethod || 'UPI (Paid)'}</Text>
              </View>
            </View>

            {/* Line Items */}
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Itemized Details</Text>
            <View
              style={[
                styles.tableCard,
                {
                  backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                  borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{booking.doctorName}</Text>
                  <Text style={styles.itemSubtitle}>{booking.speciality} • In-Clinic Consultation</Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.text }]}>₹{itemTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Item Subtotal</Text>
                <Text style={[styles.calcVal, { color: colors.text }]}>₹{itemTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>GST (18% Govt. taxes)</Text>
                <Text style={[styles.calcVal, { color: colors.text }]}>₹{tax.toFixed(2)}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Platform Fee</Text>
                <Text style={[styles.calcVal, { color: colors.text }]}>₹{platformFee.toFixed(2)}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={[styles.calcLabel, { color: '#10B981' }]}>Coupon Applied (AROGYON)</Text>
                <Text style={[styles.calcVal, { color: '#10B981' }]}>-₹{discount.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount Paid</Text>
                <Text style={[styles.totalVal, { color: '#4F46E5' }]}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Accreditation Badge */}
            <View style={styles.verifiedRow}>
              <ShieldCheck size={16} color="#10B981" />
              <Text style={styles.verifiedText}>
                Digitally verified by Arogyon Healthcare • NABH & ISO 9001:2015 Accredited
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
              <Share2 size={18} color="#4F46E5" />
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Download size={18} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  invoiceBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    color: '#64748B',
  },
  metaVal: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  tableCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calcLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#64748B',
  },
  calcVal: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
  },
  totalVal: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '800',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  verifiedText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: '#10B981',
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  shareBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '700',
  },
  downloadBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  downloadBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
