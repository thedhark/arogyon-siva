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
  ActivityIndicator,
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
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=100' },
  { id: 'sbi', name: 'State Bank of India', logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=100' },
  { id: 'icici', name: 'ICICI Bank', logo: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=100' },
  { id: 'axis', name: 'Axis Bank', logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=100' },
];

export default function GlobalPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const bookAppointment = useBookingStore(state => state.bookAppointment);

  const amount = (params.totalPayable as string) || '699';
  const doctorId = (params.doctorId as string) || 'doc-1';
  const doctorName = (params.doctorName as string) || 'Dr. Arjun Mehta';
  const speciality = (params.speciality as string) || 'Physiotherapy';
  const hospitalName = (params.hospitalName as string) || 'Apollo Clinic';
  const location = (params.location as string) || 'Koramangala, Bangalore';
  const date = (params.date as string) || 'Today';
  const time = (params.time as string) || '10:00 AM';
  const type = (params.type as string) || 'In-Clinic';
  const doctorImage = (params.doctorImage as string) || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Card details form
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const pId = `PAY-RZP-${Date.now().toString().slice(-6)}`;
      let methodStr = 'UPI (Instant)';
      if (selectedMethod === 'upi') {
        const appName = selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'UPI';
        methodStr = `UPI (${appName})`;
      } else if (selectedMethod === 'card') {
        const last4 = cardNumber.slice(-4) || '4242';
        methodStr = `Credit Card (•••• ${last4})`;
      } else if (selectedMethod === 'netbanking') {
        methodStr = `Net Banking (${selectedBank.toUpperCase()})`;
      }

      const feeNum = parseFloat(amount) || 699;
      const taxNum = Math.round(feeNum * 0.05);
      const discountNum = 50;
      const totalPaidNum = feeNum;

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
    }, 1800);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderBottomColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color={colors.text} size={22} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Checkout</Text>
          <View style={styles.secureHeaderPill}>
            <ShieldCheck size={11} color="#10B981" />
            <Text style={styles.secureHeaderText}>Razorpay 256-bit Encrypted</Text>
          </View>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Payable Amount Summary Banner */}
        <View style={[styles.amountBanner, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerLabel}>Total Amount Payable</Text>
            <Text style={[styles.bannerAmount, { color: colors.text }]}>₹{amount}</Text>
            <Text style={styles.bannerSubtext}>Including Consultation, Add-ons & Taxes</Text>
          </View>

          <View style={styles.razorpayBadge}>
            <Zap size={14} color="#3B82F6" />
            <Text style={styles.razorpayBadgeText}>Razorpay Instant</Text>
          </View>
        </View>

        {/* Payment Methods Selection */}
        <Text style={styles.sectionTitle}>SELECT PAYMENT METHOD</Text>

        {/* Method 1: UPI Payments */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: selectedMethod === 'upi' ? '#10B981' : (isDark ? '#333' : '#E5E7EB') }
          ]}
          onPress={() => setSelectedMethod('upi')}
          activeOpacity={0.85}
        >
          <View style={styles.methodHeader}>
            <View style={[styles.methodIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Smartphone size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>UPI / Instant QR</Text>
              <Text style={styles.methodSubtitle}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>

            <View style={[styles.radioCircle, selectedMethod === 'upi' && styles.radioActive]}>
              {selectedMethod === 'upi' && <Check size={12} color="#FFFFFF" />}
            </View>
          </View>

          {selectedMethod === 'upi' && (
            <View style={styles.upiExpandBox}>
              <Text style={styles.expandLabel}>Popular UPI Apps</Text>
              <View style={styles.upiAppsRow}>
                {[
                  { id: 'gpay', name: 'GPay', color: '#4285F4' },
                  { id: 'phonepe', name: 'PhonePe', color: '#5F259F' },
                  { id: 'paytm', name: 'Paytm', color: '#00BAF2' },
                  { id: 'custom', name: 'UPI ID', color: '#10B981' },
                ].map(app => (
                  <TouchableOpacity
                    key={app.id}
                    style={[
                      styles.upiAppChip,
                      selectedUpiApp === app.id && { borderColor: app.color, backgroundColor: isDark ? '#2A2A2A' : '#F0FDF4' }
                    ]}
                    onPress={() => setSelectedUpiApp(app.id as any)}
                  >
                    <Text style={[styles.upiAppText, { color: selectedUpiApp === app.id ? app.color : colors.text }]}>
                      {app.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedUpiApp === 'custom' && (
                <View style={styles.upiInputWrapper}>
                  <TextInput
                    style={[styles.upiInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
                    placeholder="e.g. mobile@upi or username@okaxis"
                    placeholderTextColor="#9CA3AF"
                    value={upiId}
                    onChangeText={setUpiId}
                    autoCapitalize="none"
                  />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Method 2: Credit / Debit Cards */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: selectedMethod === 'card' ? '#10B981' : (isDark ? '#333' : '#E5E7EB') }
          ]}
          onPress={() => setSelectedMethod('card')}
          activeOpacity={0.85}
        >
          <View style={styles.methodHeader}>
            <View style={[styles.methodIconBox, { backgroundColor: '#EFF6FF' }]}>
              <CreditCard size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Credit / Debit Cards</Text>
              <Text style={styles.methodSubtitle}>Visa, MasterCard, RuPay, Amex</Text>
            </View>

            <View style={[styles.radioCircle, selectedMethod === 'card' && styles.radioActive]}>
              {selectedMethod === 'card' && <Check size={12} color="#FFFFFF" />}
            </View>
          </View>

          {selectedMethod === 'card' && (
            <View style={styles.cardFormBox}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Card Number</Text>
                <TextInput
                  style={[styles.cardInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
                  placeholder="4532 •••• •••• 8901"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    style={[styles.cardInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
                    placeholder="08/28"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>CVV Code</Text>
                  <TextInput
                    style={[styles.cardInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
                    placeholder="•••"
                    placeholderTextColor="#9CA3AF"
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

        {/* Method 3: Net Banking */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: selectedMethod === 'netbanking' ? '#10B981' : (isDark ? '#333' : '#E5E7EB') }
          ]}
          onPress={() => setSelectedMethod('netbanking')}
          activeOpacity={0.85}
        >
          <View style={styles.methodHeader}>
            <View style={[styles.methodIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Building2 size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Net Banking</Text>
              <Text style={styles.methodSubtitle}>All major Indian banks supported</Text>
            </View>

            <View style={[styles.radioCircle, selectedMethod === 'netbanking' && styles.radioActive]}>
              {selectedMethod === 'netbanking' && <Check size={12} color="#FFFFFF" />}
            </View>
          </View>

          {selectedMethod === 'netbanking' && (
            <View style={styles.bankGrid}>
              {POPULAR_BANKS.map(bank => (
                <TouchableOpacity
                  key={bank.id}
                  style={[
                    styles.bankChip,
                    selectedBank === bank.id && { borderColor: '#10B981', backgroundColor: isDark ? '#2A2A2A' : '#ECFDF5' }
                  ]}
                  onPress={() => setSelectedBank(bank.id)}
                >
                  <Text style={[styles.bankText, { color: colors.text }]}>{bank.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Trust & Encryption Disclaimer */}
        <View style={styles.securityTrustRow}>
          <Lock size={14} color="#10B981" />
          <Text style={styles.securityTrustText}>
            Your payment info is encrypted with bank-grade 256-bit SSL protocols.
          </Text>
        </View>

      </ScrollView>

      {/* Sticky Booking Payment Action Bar matching exact design */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹167"
        price={amount}
        originalPrice={Math.round(parseFloat(amount || '699') * 2.5)}
        discountText="60% Off"
        ctaText={isProcessing ? "Processing..." : `Pay ₹${amount}`}
        ctaIcon="check"
        onPressCTA={handlePayNow}
        disabled={isProcessing}
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  secureHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  secureHeaderText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  amountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  bannerAmount: {
    fontSize: 26,
    fontWeight: '900',
    marginVertical: 2,
  },
  bannerSubtext: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  razorpayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  razorpayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  methodCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  upiExpandBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  expandLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  upiAppChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiAppText: {
    fontSize: 12,
    fontWeight: '700',
  },
  upiInputWrapper: {
    marginTop: 10,
  },
  upiInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  cardFormBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  cardInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
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
    borderTopColor: '#F3F4F6',
  },
  bankChip: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  bankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  securityTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
  },
  securityTrustText: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  floatingCapsuleContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
  },
  floatingCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  feeLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  bookCapsuleBtn: {
    backgroundColor: '#10B981',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
