import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, User, Users, Tag, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CouponOverlay from '@/components/packages/CouponOverlay';
import PaymentGatewayModal, { PaymentDetails } from '@/components/booking/PaymentGatewayModal';

export default function CheckoutScreen() {
  const { packageId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [bookingFor, setBookingFor] = useState<'self' | 'family'>('self');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [useInsurance, setUseInsurance] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [showCouponOverlay, setShowCouponOverlay] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock package data
  const packagePrice = 24999;
  const discount = couponCode ? 2000 : 0;
  const totalAmount = packagePrice - discount;

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Package Summary & Details */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Complete Pregnancy Package</Text>
          <Text style={styles.cardSubtitle}>Cloudnine Hospitals • HSR Layout</Text>
          
          <View style={styles.inclusionsBox}>
            <View style={styles.inclusionItem}>
              <CheckCircle2 size={14} color="#4CAF50" />
              <Text style={[styles.inclusionText, { color: colors.text }]}>40 Weeks Consultation</Text>
            </View>
            <View style={styles.inclusionItem}>
              <CheckCircle2 size={14} color="#4CAF50" />
              <Text style={[styles.inclusionText, { color: colors.text }]}>30+ Tests & Scans</Text>
            </View>
            <View style={styles.inclusionItem}>
              <CheckCircle2 size={14} color="#4CAF50" />
              <Text style={[styles.inclusionText, { color: colors.text }]}>Delivery (Normal/C-Section)</Text>
            </View>
            <View style={styles.inclusionItem}>
              <CheckCircle2 size={14} color="#4CAF50" />
              <Text style={[styles.inclusionText, { color: colors.text }]}>2-4 Days Private Room Stay</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Package Price</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>₹{packagePrice.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Patient Details */}
        <Animated.View entering={FadeInDown.delay(150)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Details</Text>
          
          <View style={styles.bookingForContainer}>
            <TouchableOpacity 
              style={[styles.bookingForBtn, bookingFor === 'self' && styles.bookingForBtnActive]}
              onPress={() => setBookingFor('self')}
            >
              <User size={16} color={bookingFor === 'self' ? '#E91E63' : '#666'} />
              <Text style={[styles.bookingForText, bookingFor === 'self' && styles.bookingForTextActive]}>Self</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.bookingForBtn, bookingFor === 'family' && styles.bookingForBtnActive]}
              onPress={() => setBookingFor('family')}
            >
              <Users size={16} color={bookingFor === 'family' ? '#E91E63' : '#666'} />
              <Text style={[styles.bookingForText, bookingFor === 'family' && styles.bookingForTextActive]}>Family Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', color: colors.text }]}
              placeholder="Enter patient's name"
              placeholderTextColor="#999"
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', color: colors.text }]}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={patientPhone}
              onChangeText={setPatientPhone}
            />
          </View>
        </Animated.View>

        {/* Offers & Coupons */}
        <Animated.View entering={FadeInDown.delay(200)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <TouchableOpacity 
            style={styles.couponBtn}
            onPress={() => setShowCouponOverlay(true)}
          >
            <View style={styles.couponLeft}>
              <View style={styles.couponIconBox}>
                <Tag size={20} color="#E91E63" />
              </View>
              <View>
                {couponCode ? (
                  <>
                    <Text style={[styles.couponTitle, { color: colors.text }]}>'{couponCode}' applied</Text>
                    <Text style={styles.couponSaved}>You saved ₹2,000</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.couponTitle, { color: colors.text }]}>Apply Coupon</Text>
                    <Text style={styles.couponSubtitle}>Check available offers</Text>
                  </>
                )}
              </View>
            </View>
            {couponCode ? (
              <TouchableOpacity onPress={() => setCouponCode(null)}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <ChevronLeft size={20} color="#999" style={{ transform: [{ rotate: '180deg' }] }} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Payment / Insurance */}
        <Animated.View entering={FadeInDown.delay(250)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.insuranceRow}>
            <View style={styles.insuranceLeft}>
              <ShieldCheck size={24} color="#4CAF50" />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>Pay via Insurance</Text>
                <Text style={styles.cardSubtitle}>Check if your policy covers this</Text>
              </View>
            </View>
            <Switch
              value={useInsurance}
              onValueChange={setUseInsurance}
              trackColor={{ false: '#d3d3d3', true: '#F48FB1' }}
              thumbColor={useInsurance ? '#E91E63' : '#f4f3f4'}
            />
          </View>
        </Animated.View>

        {/* Bill Details */}
        <Animated.View entering={FadeInDown.delay(300)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Package Price</Text>
            <Text style={[styles.billValue, { color: colors.text }]}>₹{packagePrice.toLocaleString()}</Text>
          </View>
          
          {couponCode && (
            <View style={styles.billRow}>
              <Text style={styles.billLabelDiscount}>Coupon Discount ({couponCode})</Text>
              <Text style={styles.billValueDiscount}>- ₹{discount.toLocaleString()}</Text>
            </View>
          )}

          <View style={[styles.divider, { marginVertical: 12 }]} />
          
          <View style={styles.billRow}>
            <Text style={[styles.billTotalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.billTotalValue, { color: colors.text }]}>₹{totalAmount.toLocaleString()}</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.bottomTotalLabel}>Total Payable</Text>
            <Text style={[styles.bottomTotalValue, { color: colors.text }]}>₹{totalAmount.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.payBtnText}>Pay & Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CouponOverlay 
        visible={showCouponOverlay}
        onClose={() => setShowCouponOverlay(false)}
        onApply={handleApplyCoupon}
      />

      <PaymentGatewayModal
        visible={showPaymentModal}
        amount={totalAmount}
        title="Package Booking Payment"
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(payment) => {
          setShowPaymentModal(false);
          router.replace({
            pathname: '/booking/success',
            params: { appointmentId: payment.paymentId },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150, // Space for bottom bar
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  inclusionsBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inclusionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  bookingForContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  bookingForBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  bookingForBtnActive: {
    borderColor: '#E91E63',
    backgroundColor: '#FCE4EC',
  },
  bookingForText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  bookingForTextActive: {
    color: '#E91E63',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  couponBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  couponSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  couponSaved: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  removeCouponText: {
    color: '#E91E63',
    fontWeight: '700',
    fontSize: 13,
  },
  insuranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insuranceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  billLabelDiscount: {
    fontSize: 14,
    color: '#4CAF50',
  },
  billValueDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  bottomTotalValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  payBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
