import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, ZoomIn } from 'react-native-reanimated';

export interface PaymentDetails {
  paymentId: string;
  method: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  amount: number;
  date: string;
}

interface PaymentGatewayModalProps {
  visible: boolean;
  amount: number;
  title?: string;
  onClose: () => void;
  onSuccess: (payment: PaymentDetails) => void;
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', color: '#4285F4', iconName: 'GPay' },
  { id: 'phonepe', name: 'PhonePe', color: '#5F259F', iconName: 'Pe' },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2', iconName: 'Paytm' },
  { id: 'bhim', name: 'BHIM UPI', color: '#FF9900', iconName: 'UPI' },
];

const POPULAR_BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'];

export default function PaymentGatewayModal({
  visible,
  amount,
  title = 'Arogyon Secure Payment',
  onClose,
  onSuccess,
}: PaymentGatewayModalProps) {
  const { colors, isDark } = useTheme();

  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [upiId, setUpiId] = useState<string>('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');

  // Selected Bank
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Processing state
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handlePayNow = () => {
    setPaymentState('processing');

    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        const paymentDetails: PaymentDetails = {
          paymentId: `PAY_${Math.floor(10000000 + Math.random() * 90000000)}`,
          method: selectedMethod,
          amount,
          date: new Date().toISOString(),
        };
        setPaymentState('idle');
        onSuccess(paymentDetails);
      }, 1200);
    }, 1800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalSheet, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
          
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#F4F4F5' }]}>
            <View>
              <View style={styles.badgeRow}>
                <Lock size={12} color="#10B981" />
                <Text style={styles.badgeText}>256-Bit Encrypted</Text>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {paymentState === 'processing' && (
            <Animated.View entering={ZoomIn} style={styles.centerStatusContainer}>
              <View style={[styles.statusCircle, { backgroundColor: '#3B82F615' }]}>
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Processing Payment...</Text>
              <Text style={styles.statusSub}>Connecting to bank gateway safely</Text>
              <View style={styles.amountPill}>
                <Text style={styles.amountPillText}>Total Amount: ₹{amount.toLocaleString()}</Text>
              </View>
            </Animated.View>
          )}

          {paymentState === 'success' && (
            <Animated.View entering={ZoomIn} style={styles.centerStatusContainer}>
              <View style={[styles.statusCircle, { backgroundColor: '#10B98115' }]}>
                <CheckCircle2 size={56} color="#10B981" />
              </View>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Payment Successful!</Text>
              <Text style={styles.statusSub}>Transaction authorized successfully</Text>
              <View style={[styles.amountPill, { backgroundColor: '#10B98115' }]}>
                <Text style={[styles.amountPillText, { color: '#10B981' }]}>Paid: ₹{amount.toLocaleString()}</Text>
              </View>
            </Animated.View>
          )}

          {paymentState === 'idle' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
              {/* Payable Amount Summary Banner */}
              <View style={[styles.amountCard, { backgroundColor: isDark ? '#27272A' : '#F0FDFA', borderColor: isDark ? '#3F3F46' : '#CCFBF1' }]}>
                <View>
                  <Text style={styles.amountCardLabel}>Payable Amount</Text>
                  <Text style={[styles.amountCardValue, { color: colors.text }]}>₹{amount.toLocaleString()}</Text>
                </View>
                <View style={styles.guaranteeBadge}>
                  <ShieldCheck size={16} color="#0D9488" />
                  <Text style={styles.guaranteeText}>Arogyon Protection</Text>
                </View>
              </View>

              {/* Payment Methods Selector Tabs */}
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Select Payment Method</Text>
              
              <View style={styles.methodGrid}>
                <TouchableOpacity
                  style={[
                    styles.methodTab,
                    { backgroundColor: isDark ? '#27272A' : '#FAFAFA', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                    selectedMethod === 'UPI' && styles.methodTabActive,
                  ]}
                  onPress={() => setSelectedMethod('UPI')}
                >
                  <Smartphone size={20} color={selectedMethod === 'UPI' ? '#0D9488' : '#71717A'} />
                  <Text style={[styles.methodTabText, selectedMethod === 'UPI' && styles.methodTabTextActive]}>UPI Apps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodTab,
                    { backgroundColor: isDark ? '#27272A' : '#FAFAFA', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                    selectedMethod === 'Card' && styles.methodTabActive,
                  ]}
                  onPress={() => setSelectedMethod('Card')}
                >
                  <CreditCard size={20} color={selectedMethod === 'Card' ? '#0D9488' : '#71717A'} />
                  <Text style={[styles.methodTabText, selectedMethod === 'Card' && styles.methodTabTextActive]}>Cards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodTab,
                    { backgroundColor: isDark ? '#27272A' : '#FAFAFA', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                    selectedMethod === 'NetBanking' && styles.methodTabActive,
                  ]}
                  onPress={() => setSelectedMethod('NetBanking')}
                >
                  <Building2 size={20} color={selectedMethod === 'NetBanking' ? '#0D9488' : '#71717A'} />
                  <Text style={[styles.methodTabText, selectedMethod === 'NetBanking' && styles.methodTabTextActive]}>Net Banking</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodTab,
                    { backgroundColor: isDark ? '#27272A' : '#FAFAFA', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                    selectedMethod === 'COD' && styles.methodTabActive,
                  ]}
                  onPress={() => setSelectedMethod('COD')}
                >
                  <Banknote size={20} color={selectedMethod === 'COD' ? '#0D9488' : '#71717A'} />
                  <Text style={[styles.methodTabText, selectedMethod === 'COD' && styles.methodTabTextActive]}>Pay at Clinic</Text>
                </TouchableOpacity>
              </View>

              {/* Method 1: UPI Options */}
              {selectedMethod === 'UPI' && (
                <Animated.View entering={FadeInDown} style={styles.methodContent}>
                  <Text style={styles.subTextLabel}>Fast Instant Payment via Installed Apps</Text>
                  
                  <View style={styles.upiGrid}>
                    {UPI_APPS.map((app) => (
                      <TouchableOpacity
                        key={app.id}
                        style={[
                          styles.upiCard,
                          { backgroundColor: isDark ? '#27272A' : '#FFFFFF', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                          selectedUpiApp === app.id && { borderColor: '#0D9488', borderWidth: 2, backgroundColor: '#F0FDFA' },
                        ]}
                        onPress={() => setSelectedUpiApp(app.id)}
                      >
                        <View style={[styles.upiIconBg, { backgroundColor: app.color }]}>
                          <Text style={styles.upiIconText}>{app.iconName}</Text>
                        </View>
                        <Text style={[styles.upiAppName, { color: colors.text }]}>{app.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.subTextLabel, { marginTop: 16 }]}>Or Enter UPI VPA ID</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? '#27272A' : '#F4F4F5', color: colors.text, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                    placeholder="e.g. mobile@upi or username@okicici"
                    placeholderTextColor="#A1A1AA"
                    value={upiId}
                    onChangeText={setUpiId}
                  />
                </Animated.View>
              )}

              {/* Method 2: Credit / Debit Card */}
              {selectedMethod === 'Card' && (
                <Animated.View entering={FadeInDown} style={styles.methodContent}>
                  <Text style={styles.subTextLabel}>Card Details</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: isDark ? '#27272A' : '#F4F4F5', color: colors.text, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                      placeholder="4532 •••• •••• 8901"
                      placeholderTextColor="#A1A1AA"
                      keyboardType="numeric"
                      value={cardNumber}
                      onChangeText={formatCardNumber}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: isDark ? '#27272A' : '#F4F4F5', color: colors.text, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                        placeholder="MM/YY"
                        placeholderTextColor="#A1A1AA"
                        keyboardType="numeric"
                        value={cardExpiry}
                        onChangeText={formatExpiry}
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: isDark ? '#27272A' : '#F4F4F5', color: colors.text, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                        placeholder="123"
                        placeholderTextColor="#A1A1AA"
                        keyboardType="numeric"
                        secureTextEntry
                        maxLength={4}
                        value={cardCvv}
                        onChangeText={setCardCvv}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: isDark ? '#27272A' : '#F4F4F5', color: colors.text, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                      placeholder="Name as printed on card"
                      placeholderTextColor="#A1A1AA"
                      value={cardName}
                      onChangeText={setCardName}
                    />
                  </View>
                </Animated.View>
              )}

              {/* Method 3: Netbanking */}
              {selectedMethod === 'NetBanking' && (
                <Animated.View entering={FadeInDown} style={styles.methodContent}>
                  <Text style={styles.subTextLabel}>Popular Banks</Text>
                  
                  <View style={styles.bankList}>
                    {POPULAR_BANKS.map((bank) => (
                      <TouchableOpacity
                        key={bank}
                        style={[
                          styles.bankItem,
                          { backgroundColor: isDark ? '#27272A' : '#FFFFFF', borderColor: isDark ? '#3F3F46' : '#E4E4E7' },
                          selectedBank === bank && { borderColor: '#0D9488', backgroundColor: '#F0FDFA' },
                        ]}
                        onPress={() => setSelectedBank(bank)}
                      >
                        <Building2 size={18} color={selectedBank === bank ? '#0D9488' : '#71717A'} />
                        <Text style={[styles.bankName, { color: colors.text }]}>{bank}</Text>
                        {selectedBank === bank && <CheckCircle2 size={16} color="#0D9488" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              )}

              {/* Method 4: COD / Pay at Clinic */}
              {selectedMethod === 'COD' && (
                <Animated.View entering={FadeInDown} style={styles.methodContent}>
                  <View style={[styles.codBanner, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B40' }]}>
                    <Banknote size={24} color="#D97706" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.codTitle, { color: colors.text }]}>Pay directly at consultation</Text>
                      <Text style={styles.codSub}>You can pay via Cash, Card or UPI when you arrive for your appointment.</Text>
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* Confirm Pay Button */}
              <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                <Lock size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.payButtonText}>
                  {selectedMethod === 'COD' ? 'Confirm Booking (Pay Later)' : `Pay ₹${amount.toLocaleString()} Securely`}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalSheet: {
    flex: 1,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 20,
  },
  amountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  amountCardLabel: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '600',
  },
  amountCardValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  methodGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  methodTabActive: {
    borderColor: '#0D9488',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
  },
  methodTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
  },
  methodTabTextActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  methodContent: {
    marginBottom: 24,
  },
  subTextLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717A',
    marginBottom: 10,
  },
  upiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  upiCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  upiIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiIconText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  upiAppName: {
    fontSize: 13,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  bankList: {
    gap: 8,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  bankName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  codBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  codTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  codSub: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    lineHeight: 16,
  },
  payButton: {
    backgroundColor: '#0D9488',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  centerStatusContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  statusSub: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 16,
  },
  amountPill: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amountPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#71717A',
  },
});
