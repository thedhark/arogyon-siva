import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  Check,
  QrCode,
  BadgePercent,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';
import { useScrollFooter } from '@/hooks/useScrollFooter';
import PaymentProcessingModal from '@/components/payments/PaymentProcessingModal';

const { width } = Dimensions.get('window');

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
];

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', tag: 'Fast', color: '#4285F4', gradient: ['#4285F4', '#34A853'] },
  { id: 'phonepe', name: 'PhonePe', tag: 'Popular', color: '#5F259F', gradient: ['#5F259F', '#7E22CE'] },
  { id: 'paytm', name: 'Paytm UPI', tag: 'Instant', color: '#00BAF2', gradient: ['#00BAF2', '#0284C7'] },
  { id: 'custom', name: 'Enter UPI ID', tag: 'Manual', color: '#10B981', gradient: ['#10B981', '#059669'] },
];

export default function GlobalPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const bookAppointment = useBookingStore((state) => state.bookAppointment);
  const walletBalance = useProfileStore((state) => state.walletBalance);
  const deductWalletBalance = useProfileStore((state) => state.deductWalletBalance);

  const { isFooterVisible, scrollProps } = useScrollFooter({ threshold: 12, topThreshold: 30 });

  const amount = (params.totalPayable as string) || (params.amount as string) || '699';
  const doctorId = (params.doctorId as string) || 'doc-1';
  const doctorName = (params.doctorName as string) || 'Dr. Arjun Mehta';
  const speciality = (params.speciality as string) || 'Physiotherapy & Sports';
  const hospitalName = (params.hospitalName as string) || 'Apollo Health City';
  const location = (params.location as string) || 'Koramangala, Bangalore';
  const date = (params.date as string) || 'Today';
  const time = (params.time as string) || '10:00 AM';
  const type = (params.type as string) || 'In-Clinic';
  const doctorImage =
    (params.doctorImage as string) ||
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const feeNum = parseFloat(amount) || 699;
  const originalPrice = Math.round(feeNum * 2.2);
  const savings = originalPrice - feeNum;

  const getMethodName = () => {
    if (selectedMethod === 'upi') {
      const app = UPI_APPS.find((a) => a.id === selectedUpiApp);
      return `UPI (${app?.name || 'Instant'})`;
    } else if (selectedMethod === 'card') {
      const last4 = cardNumber.slice(-4) || '8842';
      return `Credit Card (•••• ${last4})`;
    } else if (selectedMethod === 'netbanking') {
      const bank = POPULAR_BANKS.find((b) => b.id === selectedBank);
      return `Net Banking (${bank?.name || 'HDFC'})`;
    } else if (selectedMethod === 'wallet') {
      return 'Arogyon Health Wallet';
    }
    return 'Arogyon Secure Pay';
  };

  const handleSelectMethod = (m: PaymentMethodType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMethod(m);
  };

  const handlePayNow = () => {
    if (selectedMethod === 'wallet') {
      if (walletBalance < feeNum) {
        Alert.alert(
          'Insufficient Wallet Balance',
          `Your wallet balance is ₹${walletBalance}. Please select another payment method or add funds to your wallet.`,
          [{ text: 'OK' }]
        );
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);
  };

  const handleProcessSuccess = () => {
    setIsProcessing(false);

    const pId = `AROGYON-PAY-${Date.now().toString().slice(-6)}`;
    const methodStr = getMethodName();
    const taxNum = Math.round(feeNum * 0.05);
    const discountNum = 50;
    const totalPaidNum = feeNum;

    if (selectedMethod === 'wallet') {
      deductWalletBalance(totalPaidNum, `Booking: ${doctorName}`);
    }

    const appointmentId = bookAppointment({
      doctorId,
      doctorName,
      speciality,
      hospitalName,
      location,
      date,
      time,
      fee: amount,
      type,
      image: doctorImage,
      paymentId: pId,
      paymentMethod: methodStr,
      paymentStatus: 'paid',
      category: 'consultation',
      consultationFee: feeNum,
      taxFee: taxNum,
      discount: discountNum,
      totalPaid: totalPaidNum,
      transactionDate: new Date().toISOString(),
    });

    router.replace({
      pathname: '/booking/success',
      params: { appointmentId, paymentId: pId, amount },
    });
  };

  const handleBackWithCancelCheck = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Cancel Payment?',
      'Are you sure you want to cancel this booking checkout?',
      [
        { text: 'Continue Payment', style: 'cancel' },
        {
          text: 'Cancel & Exit',
          style: 'destructive',
          onPress: () => {
            router.replace({
              pathname: '/booking/failed',
              params: {
                ...params,
                reason: 'cancelled',
                amount,
                doctorName,
                hospitalName,
                speciality,
                date,
                time,
                doctorImage,
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0B0D13' : '#F8FAFC' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: isDark ? '#11141E' : '#FFFFFF',
            borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBackWithCancelCheck}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C2130' : '#F1F5F9' }]}
          activeOpacity={0.7}
        >
          <ArrowLeft color={colors.text} size={20} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payment & Checkout</Text>
          <View style={styles.secureHeaderPill}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.secureHeaderText}>Arogyon Direct Pay</Text>
          </View>
        </View>

        <View style={styles.headerShieldBox}>
          <ShieldCheck size={18} color="#10B981" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {/* Hero Payable Summary Card with Arogyon Signature Gradient */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.heroCardContainer}>
          <LinearGradient
            colors={isDark ? ['#132438', '#0F1A2A', '#0D1420'] : ['#0F2B48', '#0C3B5E', '#065F46']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Top Row: Doctor/Booking preview */}
            <View style={styles.heroTopRow}>
              <Image source={{ uri: doctorImage }} style={styles.doctorAvatar} resizeMode="cover" />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorNameText} numberOfLines={1}>
                  {doctorName}
                </Text>
                <Text style={styles.doctorSpecialityText} numberOfLines={1}>
                  {speciality} • {hospitalName}
                </Text>
                <View style={styles.dateTimeBadge}>
                  <Calendar size={11} color="#38BDF8" />
                  <Text style={styles.dateTimeText}>{date}</Text>
                  <Text style={styles.dateTimeDot}>•</Text>
                  <Clock size={11} color="#38BDF8" />
                  <Text style={styles.dateTimeText}>{time}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.heroDivider} />

            {/* Bottom Row: Amount & Savings */}
            <View style={styles.heroBottomRow}>
              <View>
                <Text style={styles.heroAmountLabel}>Total Amount to Pay</Text>
                <View style={styles.amountDisplayRow}>
                  <Text style={styles.heroAmountCurrency}>₹</Text>
                  <Text style={styles.heroAmountValue}>{amount}</Text>
                  <Text style={styles.heroOriginalPrice}>₹{originalPrice}</Text>
                </View>
              </View>

              <View style={styles.savingsPill}>
                <Sparkles size={13} color="#34D399" />
                <Text style={styles.savingsText}>Save ₹{savings}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Section Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            SELECT PAYMENT METHOD
          </Text>
          <View style={styles.verifiedPill}>
            <Zap size={11} color="#10B981" />
            <Text style={styles.verifiedText}>Instant Verification</Text>
          </View>
        </View>

        {/* Method 1: UPI / Instant Apps */}
        <Animated.View entering={FadeInDown.delay(160)}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: isDark ? '#141824' : '#FFFFFF',
                borderColor: selectedMethod === 'upi' ? '#10B981' : isDark ? '#1E2435' : '#E2E8F0',
                shadowOpacity: selectedMethod === 'upi' ? 0.08 : 0.02,
              },
            ]}
            onPress={() => handleSelectMethod('upi')}
            activeOpacity={0.85}
          >
            <View style={styles.methodHeader}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.methodIconBox}
              >
                <Smartphone size={20} color="#FFFFFF" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <View style={styles.methodTitleRow}>
                  <Text style={[styles.methodTitle, { color: colors.text }]}>UPI / Instant QR</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                  </View>
                </View>
                <Text style={[styles.methodSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Google Pay, PhonePe, Paytm, BHIM UPI
                </Text>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'upi' && { backgroundColor: '#10B981', borderColor: '#10B981' },
                ]}
              >
                {selectedMethod === 'upi' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </View>

            {selectedMethod === 'upi' && (
              <View style={styles.upiExpandBox}>
                <Text style={[styles.expandLabel, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                  Choose Your Preferred App
                </Text>
                <View style={styles.upiAppsGrid}>
                  {UPI_APPS.map((app) => {
                    const isAppSelected = selectedUpiApp === app.id;
                    return (
                      <TouchableOpacity
                        key={app.id}
                        style={[
                          styles.upiAppChip,
                          {
                            backgroundColor: isAppSelected
                              ? isDark
                                ? '#1B2A38'
                                : '#F0FDF4'
                              : isDark
                              ? '#1C2130'
                              : '#F8FAFC',
                            borderColor: isAppSelected ? app.color : isDark ? '#262F44' : '#E2E8F0',
                          },
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setSelectedUpiApp(app.id as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.appDot, { backgroundColor: app.color }]} />
                        <Text
                          style={[
                            styles.upiAppText,
                            { color: isAppSelected ? colors.text : isDark ? '#94A3B8' : '#64748B' },
                          ]}
                        >
                          {app.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {selectedUpiApp === 'custom' && (
                  <View style={styles.upiInputWrapper}>
                    <TextInput
                      style={[
                        styles.upiInput,
                        {
                          color: colors.text,
                          borderColor: isDark ? '#334155' : '#CBD5E1',
                          backgroundColor: isDark ? '#182030' : '#F1F5F9',
                        },
                      ]}
                      placeholder="e.g. mobile@upi or username@okaxis"
                      placeholderTextColor="#94A3B8"
                      value={upiId}
                      onChangeText={setUpiId}
                      autoCapitalize="none"
                    />
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Method 2: Arogyon Health Wallet */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: isDark ? '#141824' : '#FFFFFF',
                borderColor: selectedMethod === 'wallet' ? '#2563EB' : isDark ? '#1E2435' : '#E2E8F0',
                shadowOpacity: selectedMethod === 'wallet' ? 0.08 : 0.02,
              },
            ]}
            onPress={() => handleSelectMethod('wallet')}
            activeOpacity={0.85}
          >
            <View style={styles.methodHeader}>
              <LinearGradient
                colors={['#38BDF8', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.methodIconBox}
              >
                <Wallet size={20} color="#FFFFFF" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <View style={styles.methodTitleRow}>
                  <Text style={[styles.methodTitle, { color: colors.text }]}>Arogyon Health Wallet</Text>
                  <View
                    style={[
                      styles.walletBalanceBadge,
                      {
                        backgroundColor:
                          walletBalance >= feeNum
                            ? isDark
                              ? '#064E3B'
                              : '#DCFCE7'
                            : isDark
                            ? '#7F1D1D'
                            : '#FEE2E2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.walletBalanceText,
                        {
                          color: walletBalance >= feeNum ? '#10B981' : '#EF4444',
                        },
                      ]}
                    >
                      Balance: ₹{walletBalance}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.methodSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {walletBalance >= feeNum
                    ? '1-Tap instant seamless checkout from wallet'
                    : `Need ₹${amount}. Balance is low.`}
                </Text>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'wallet' && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                ]}
              >
                {selectedMethod === 'wallet' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Method 3: Credit / Debit Cards */}
        <Animated.View entering={FadeInDown.delay(240)}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: isDark ? '#141824' : '#FFFFFF',
                borderColor: selectedMethod === 'card' ? '#10B981' : isDark ? '#1E2435' : '#E2E8F0',
                shadowOpacity: selectedMethod === 'card' ? 0.08 : 0.02,
              },
            ]}
            onPress={() => handleSelectMethod('card')}
            activeOpacity={0.85}
          >
            <View style={styles.methodHeader}>
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.methodIconBox}
              >
                <CreditCard size={20} color="#FFFFFF" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>Credit / Debit Cards</Text>
                <Text style={[styles.methodSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Visa, MasterCard, RuPay, Corporate Cards
                </Text>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'card' && { backgroundColor: '#10B981', borderColor: '#10B981' },
                ]}
              >
                {selectedMethod === 'card' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </View>

            {selectedMethod === 'card' && (
              <View style={styles.cardFormBox}>
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    CARD NUMBER
                  </Text>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        color: colors.text,
                        borderColor: isDark ? '#334155' : '#CBD5E1',
                        backgroundColor: isDark ? '#182030' : '#F1F5F9',
                      },
                    ]}
                    placeholder="4532 •••• •••• 8901"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={[styles.formLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      EXPIRY (MM/YY)
                    </Text>
                    <TextInput
                      style={[
                        styles.cardInput,
                        {
                          color: colors.text,
                          borderColor: isDark ? '#334155' : '#CBD5E1',
                          backgroundColor: isDark ? '#182030' : '#F1F5F9',
                        },
                      ]}
                      placeholder="08/28"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={expiry}
                      onChangeText={setExpiry}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={[styles.formLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      CVV
                    </Text>
                    <TextInput
                      style={[
                        styles.cardInput,
                        {
                          color: colors.text,
                          borderColor: isDark ? '#334155' : '#CBD5E1',
                          backgroundColor: isDark ? '#182030' : '#F1F5F9',
                        },
                      ]}
                      placeholder="•••"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={4}
                      value={cvv}
                      onChangeText={setCvv}
                    />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Method 4: Net Banking */}
        <Animated.View entering={FadeInDown.delay(280)}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: isDark ? '#141824' : '#FFFFFF',
                borderColor: selectedMethod === 'netbanking' ? '#10B981' : isDark ? '#1E2435' : '#E2E8F0',
                shadowOpacity: selectedMethod === 'netbanking' ? 0.08 : 0.02,
              },
            ]}
            onPress={() => handleSelectMethod('netbanking')}
            activeOpacity={0.85}
          >
            <View style={styles.methodHeader}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.methodIconBox}
              >
                <Building2 size={20} color="#FFFFFF" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>Net Banking</Text>
                <Text style={[styles.methodSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  All major Indian banks supported
                </Text>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'netbanking' && { backgroundColor: '#10B981', borderColor: '#10B981' },
                ]}
              >
                {selectedMethod === 'netbanking' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </View>

            {selectedMethod === 'netbanking' && (
              <View style={styles.bankGrid}>
                {POPULAR_BANKS.map((bank) => (
                  <TouchableOpacity
                    key={bank.id}
                    style={[
                      styles.bankChip,
                      {
                        backgroundColor:
                          selectedBank === bank.id
                            ? isDark
                              ? '#133527'
                              : '#ECFDF5'
                            : isDark
                            ? '#1C2130'
                            : '#F8FAFC',
                        borderColor: selectedBank === bank.id ? '#10B981' : isDark ? '#262F44' : '#E2E8F0',
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedBank(bank.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.bankText,
                        {
                          color: selectedBank === bank.id ? '#10B981' : colors.text,
                          fontWeight: selectedBank === bank.id ? '800' : '600',
                        },
                      ]}
                    >
                      {bank.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Security & Trust Banner */}
        <View style={styles.securityTrustRow}>
          <ShieldCheck size={15} color="#10B981" />
          <Text style={[styles.securityTrustText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            100% Protected & Verified by Arogyon Health Shield
          </Text>
        </View>
      </ScrollView>

      {/* Payment Processing Modal */}
      <PaymentProcessingModal
        visible={isProcessing}
        amount={amount}
        paymentMethod={getMethodName()}
        onSuccess={handleProcessSuccess}
        onFailure={(reason) => {
          setIsProcessing(false);
          router.replace({
            pathname: '/booking/failed',
            params: {
              ...params,
              reason,
              amount,
              doctorName,
              hospitalName,
              speciality,
              date,
              time,
              doctorImage,
            },
          });
        }}
      />

      {/* Sticky Booking Payment Action Bar */}
      <StickyBookingPaymentBar
        priceDropText="Instant discount applied"
        price={amount}
        originalPrice={originalPrice}
        discountText={`Save ₹${savings}`}
        ctaText={isProcessing ? 'Securing...' : `Pay ₹${amount}`}
        ctaIcon="check"
        onPressCTA={handlePayNow}
        disabled={isProcessing}
        visible={isFooterVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  secureHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  secureHeaderText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  headerShieldBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  heroCardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  heroGradient: {
    padding: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  doctorAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  doctorSpecialityText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  dateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  dateTimeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  dateTimeDot: {
    color: '#38BDF8',
    fontSize: 10,
    marginHorizontal: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 14,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroAmountLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  heroAmountCurrency: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroAmountValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroOriginalPrice: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
  },
  savingsText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  methodCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  recommendedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#A7F3D0',
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.3,
  },
  methodSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletBalanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  walletBalanceText: {
    fontSize: 10,
    fontWeight: '800',
  },
  upiExpandBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
  expandLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upiAppChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  appDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  upiAppText: {
    fontSize: 12,
    fontWeight: '700',
  },
  upiInputWrapper: {
    marginTop: 10,
  },
  upiInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  cardFormBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
    gap: 10,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
  bankChip: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  bankText: {
    fontSize: 12,
  },
  securityTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
  },
  securityTrustText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
