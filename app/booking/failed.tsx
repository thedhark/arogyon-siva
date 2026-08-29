import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  AlertTriangle,
  XCircle,
  RotateCcw,
  Building2,
  ShieldCheck,
  Home,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useBookingStore } from '@/hooks/useBookingStore';

export default function PaymentFailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const bookAppointment = useBookingStore((state) => state.bookAppointment);

  const reason = (params.reason as string) || 'declined';
  const amount = (params.amount as string) || '699';
  const doctorName = (params.doctorName as string) || 'Dr. Arjun Mehta';
  const hospitalName = (params.hospitalName as string) || 'Apollo Clinic';
  const speciality = (params.speciality as string) || 'Specialist Consult';
  const date = (params.date as string) || 'Today';
  const time = (params.time as string) || '10:00 AM';
  const doctorImage =
    (params.doctorImage as string) ||
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800';

  const getFailureInfo = () => {
    switch (reason) {
      case 'cancelled':
        return {
          title: 'Payment Cancelled',
          subtitle: 'The transaction was cancelled before confirmation.',
          detail: 'No money was deducted from your account. Your slot is held for 10 minutes.',
          iconColor: '#F59E0B',
          badgeBg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
        };
      case 'timeout':
        return {
          title: 'Bank Gateway Timed Out',
          subtitle: 'The banking server took too long to respond.',
          detail: 'If money was debited from your account, it will be automatically refunded within 24-48 hours.',
          iconColor: '#EF4444',
          badgeBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
        };
      case 'insufficient_funds':
        return {
          title: 'Insufficient Balance',
          subtitle: 'Your payment could not be processed due to low balance.',
          detail: 'Please try another account, credit card, or choose Pay at Hospital.',
          iconColor: '#EF4444',
          badgeBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
        };
      default:
        return {
          title: 'Payment Declined',
          subtitle: 'Your bank declined the transaction.',
          detail: 'Incorrect OTP/PIN or temporary bank server downtime. Please try again.',
          iconColor: '#EF4444',
          badgeBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
        };
    }
  };

  const info = getFailureInfo();

  const handleRetryPayment = () => {
    router.replace({
      pathname: '/booking/payment',
      params: {
        ...params,
        totalPayable: amount,
      },
    });
  };

  const handlePayAtHospital = () => {
    const appointmentId = bookAppointment({
      doctorId: (params.doctorId as string) || 'doc-1',
      doctorName,
      speciality,
      hospitalName,
      location: (params.location as string) || 'Bangalore',
      date,
      time,
      fee: amount,
      type: (params.type as string) || 'In-Clinic',
      image: doctorImage,
      paymentId: `PAY-OFFLINE-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'Pay at Hospital (Cash / Card)',
      paymentStatus: 'pending',
      category: 'consultation',
      consultationFee: parseFloat(amount) || 699,
      taxFee: 0,
      discount: 0,
      totalPaid: 0,
      transactionDate: new Date().toISOString(),
    });

    router.replace({
      pathname: '/booking/success',
      params: {
        appointmentId,
        doctorName,
        hospitalName,
        date,
        time,
        amount,
        type: 'In-Clinic',
        paymentMode: 'offline',
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121214' : '#F8FAFC' }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Animated Error Header Icon */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: info.badgeBg }]}>
            {reason === 'cancelled' ? (
              <AlertTriangle size={42} color={info.iconColor} strokeWidth={2.2} />
            ) : (
              <XCircle size={44} color={info.iconColor} strokeWidth={2.2} />
            )}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{info.title}</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {info.subtitle}
          </Text>

          {/* Amount Badge */}
          <View style={[styles.amountBadge, { backgroundColor: isDark ? '#1E2028' : '#FFFFFF' }]}>
            <Text style={[styles.amountLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Transaction Amount
            </Text>
            <Text style={[styles.amountVal, { color: colors.text }]}>₹{amount}</Text>
          </View>
        </Animated.View>

        {/* Order / Slot Summary Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[
            styles.summaryCard,
            {
              backgroundColor: isDark ? '#1C1F28' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.doctorRow}>
            <Image source={{ uri: doctorImage }} style={styles.doctorAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>
                {doctorName}
              </Text>
              <Text style={[styles.docSpec, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {speciality} • {hospitalName}
              </Text>
              <Text style={[styles.slotText, { color: '#00A981' }]}>
                Slot: {date} at {time}
              </Text>
            </View>
          </View>

          <View style={[styles.cardDivider, { backgroundColor: isDark ? '#2D3039' : '#F1F5F9' }]} />

          <Text style={[styles.detailText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
            {info.detail}
          </Text>
        </Animated.View>

        {/* Reassurance Box */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={[
            styles.reassuranceBox,
            {
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7',
            },
          ]}
        >
          <ShieldCheck size={20} color="#10B981" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.reassuranceTitle, { color: isDark ? '#34D399' : '#166534' }]}>
              Money Deducted? 100% Safe
            </Text>
            <Text style={[styles.reassuranceDesc, { color: isDark ? '#94A3B8' : '#15803D' }]}>
              If money was debited from your bank, it will be automatically refunded to your original payment method within 2 business days.
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.actionsContainer}>
          {/* Retry Payment Button */}
          <TouchableOpacity
            style={styles.primaryRetryBtn}
            onPress={handleRetryPayment}
            activeOpacity={0.85}
          >
            <RotateCcw size={18} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.primaryRetryText}>Retry Payment</Text>
          </TouchableOpacity>

          {/* Pay at Hospital Fallback */}
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                backgroundColor: isDark ? '#1E2028' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
              },
            ]}
            onPress={handlePayAtHospital}
            activeOpacity={0.8}
          >
            <Building2 size={18} color={colors.text} />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              Pay at Hospital (Cash / Card)
            </Text>
          </TouchableOpacity>

          {/* Return Home */}
          <TouchableOpacity
            style={styles.homeLinkBtn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Home size={16} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.homeLinkText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountVal: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '800',
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
  },
  docName: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
  },
  docSpec: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  slotText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  detailText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: Fonts.regular,
  },
  reassuranceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
  },
  reassuranceTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  reassuranceDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    fontFamily: Fonts.regular,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryRetryBtn: {
    backgroundColor: '#00A981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    shadowColor: '#00A981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryRetryText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  homeLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
  },
  homeLinkText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: '600',
  },
});
