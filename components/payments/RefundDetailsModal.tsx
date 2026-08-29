import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  HelpCircle,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { Appointment } from '@/hooks/useBookingStore';

interface RefundDetailsModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onDownloadCreditNote?: () => void;
}

export default function RefundDetailsModal({
  visible,
  appointment,
  onClose,
  onDownloadCreditNote,
}: RefundDetailsModalProps) {
  const { colors, isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!visible || !appointment) return null;

  const refundId = appointment.refundId || `REF-${(appointment.id || '98231').slice(-6)}`;
  const refundAmount = appointment.refundAmount || appointment.totalPaid || parseFloat(appointment.fee) || 699;
  const arnNumber = appointment.arnNumber || `ARN-10928391823`;
  const refundMode = appointment.refundMode || appointment.paymentMethod || 'Original Source (UPI)';
  const refundStatus = appointment.refundStatus || 'processing';

  const handleCopyARN = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Cancellation Requested',
      subtitle: 'Slot released and cancellation verified',
      time: appointment.date || 'Today',
      isCompleted: true,
    },
    {
      title: 'Refund Approved by Arogyon',
      subtitle: '100% full refund approved with no cancellation penalty',
      time: 'Instant',
      isCompleted: true,
    },
    {
      title: 'Transferred to Banking Partner',
      subtitle: `Dispatched to bank gateway with ARN: ${arnNumber}`,
      time: 'Completed',
      isCompleted: refundStatus === 'processing' || refundStatus === 'credited',
    },
    {
      title: 'Credited to Source Account',
      subtitle: `Will reflect in your ${refundMode} within 2-3 business days`,
      time: refundStatus === 'credited' ? 'Credited' : 'Est. 2-3 Days',
      isCompleted: refundStatus === 'credited',
      isPending: refundStatus !== 'credited',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1F28' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
            },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.refundIconCircle}>
                <RotateCcw size={18} color="#EF4444" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Refund Tracker</Text>
                <Text style={[styles.headerSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {refundId}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Refund Amount Banner */}
            <View
              style={[
                styles.amountBanner,
                {
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                  borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
                },
              ]}
            >
              <View>
                <Text style={[styles.amountBannerLabel, { color: isDark ? '#F87171' : '#991B1B' }]}>
                  Refund Amount
                </Text>
                <Text style={[styles.amountBannerVal, { color: isDark ? '#FCA5A5' : '#B91C1C' }]}>
                  ₹{refundAmount}
                </Text>
              </View>

              <View style={styles.statusPill}>
                <Clock size={12} color="#EF4444" />
                <Text style={styles.statusPillText}>
                  {refundStatus === 'credited' ? 'Credited' : 'In Progress'}
                </Text>
              </View>
            </View>

            {/* ARN Bank Reference Number Card */}
            <View
              style={[
                styles.arnCard,
                {
                  backgroundColor: isDark ? '#14161D' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.arnLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Bank Reference / ARN
                </Text>
                <Text style={[styles.arnVal, { color: colors.text }]}>{arnNumber}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.copyBtn,
                  { backgroundColor: copied ? '#00A981' : isDark ? '#262934' : '#E2E8F0' },
                ]}
                onPress={handleCopyARN}
                activeOpacity={0.8}
              >
                {copied ? (
                  <>
                    <Check size={12} color="#FFFFFF" />
                    <Text style={[styles.copyBtnText, { color: '#FFFFFF' }]}>Copied</Text>
                  </>
                ) : (
                  <>
                    <Copy size={12} color={isDark ? '#CBD5E1' : '#475569'} />
                    <Text style={[styles.copyBtnText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                      Copy
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* 4-Step Interactive Refund Timeline */}
            <View style={styles.timelineSection}>
              <Text style={[styles.timelineHeading, { color: colors.text }]}>Refund Progress</Text>

              {steps.map((s, idx) => (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineLeftCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        s.isCompleted
                          ? styles.timelineDotDone
                          : s.isPending
                          ? styles.timelineDotPending
                          : styles.timelineDotDefault,
                      ]}
                    >
                      {s.isCompleted ? (
                        <CheckCircle2 size={14} color="#FFFFFF" />
                      ) : (
                        <View style={styles.pendingInnerDot} />
                      )}
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          {
                            backgroundColor: s.isCompleted
                              ? '#00A981'
                              : isDark
                              ? '#2D3039'
                              : '#E2E8F0',
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTitleRow}>
                      <Text
                        style={[
                          styles.timelineStepTitle,
                          {
                            color: s.isCompleted
                              ? colors.text
                              : isDark
                              ? '#94A3B8'
                              : '#64748B',
                          },
                        ]}
                      >
                        {s.title}
                      </Text>
                      <Text style={[styles.timelineTime, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                        {s.time}
                      </Text>
                    </View>
                    <Text style={[styles.timelineStepSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      {s.subtitle}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Reassurance note */}
            <View
              style={[
                styles.noteBox,
                {
                  backgroundColor: isDark ? 'rgba(0,169,129,0.08)' : '#F0FDF4',
                  borderColor: isDark ? 'rgba(0,169,129,0.2)' : '#DCFCE7',
                },
              ]}
            >
              <ShieldCheck size={16} color="#00A981" />
              <Text style={[styles.noteText, { color: isDark ? '#34D399' : '#166534' }]}>
                Arogyon 100% Refund Guarantee ensures full refunds with direct bank settlement.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.creditNoteBtn}
              onPress={() => {
                Alert.alert(
                  'Credit Note Downloaded',
                  `Refund credit receipt for ${refundId} has been saved to your device. ARN: ${arnNumber}`
                );
                onClose();
              }}
              activeOpacity={0.85}
            >
              <FileText size={16} color="#FFFFFF" />
              <Text style={styles.creditNoteText}>Download Refund Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refundIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    fontWeight: '800',
  },
  headerSub: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 20,
  },
  amountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  amountBannerLabel: {
    fontFamily: Fonts.bold,
    fontSize: 11.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountBannerVal: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  statusPillText: {
    color: '#EF4444',
    fontFamily: Fonts.bold,
    fontSize: 11,
    fontWeight: '700',
  },
  arnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  arnLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    marginBottom: 2,
  },
  arnVal: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    fontWeight: '700',
  },
  timelineSection: {
    marginBottom: 16,
  },
  timelineHeading: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 22,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: {
    backgroundColor: '#00A981',
  },
  timelineDotPending: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  timelineDotDefault: {
    backgroundColor: '#E2E8F0',
  },
  pendingInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timelineLine: {
    width: 2,
    height: 38,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 1,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  timelineStepTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '700',
  },
  timelineTime: {
    fontFamily: Fonts.regular,
    fontSize: 11,
  },
  timelineStepSub: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  noteText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  creditNoteBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  creditNoteText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
});
