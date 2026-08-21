import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, User, Users, Tag, CreditCard, ShieldCheck, CheckCircle2, Calendar, Clock, MapPin, Sparkles, Building2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CouponOverlay from '@/components/packages/CouponOverlay';
import PaymentGatewayModal from '@/components/booking/PaymentGatewayModal';
import { getPackageById } from '@/constants/package-data';
import { useBookingStore } from '@/hooks/useBookingStore';
import { getUpcomingDates } from '@/utils/dateFormatter';

export default function CheckoutScreen() {
  const { packageId, mode } = useLocalSearchParams<{ packageId: string; mode?: string }>();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bookPackage = useBookingStore(state => state.bookPackage);
  const addCartItem = useBookingStore(state => state.addCartItem);

  const pkg = getPackageById((packageId as string) || 'default-package');
  const availableDates = getUpcomingDates(5);

  const [bookingFor, setBookingFor] = useState<'self' | 'family'>('self');
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [patientPhone, setPatientPhone] = useState('9876543210');
  
  // Preferred Consultation Slot
  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.date || 'Aug 7');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  React.useEffect(() => {
    const rawPriceStr = (pkg.price || '4999').toString().replace(/[^0-9]/g, '');
    const pkgPrice = parseFloat(rawPriceStr) || 4999;
    const rawOrigStr = (pkg.originalPrice || '').toString().replace(/[^0-9]/g, '');
    const origPrice = parseFloat(rawOrigStr) || Math.round(pkgPrice * 1.35);
    const savings = Math.max(63, origPrice - pkgPrice);

    addCartItem({
      type: 'package',
      itemId: pkg.id || `pkg-${Date.now()}`,
      title: pkg.title,
      subtitle: `${pkg.hospitalName || 'Hospital'} • ${mode === 'token' ? 'Slot Reservation' : 'Health Checkup'}`,
      price: mode === 'token' ? 499 : pkgPrice,
      originalPrice: mode === 'token' ? pkgPrice : origPrice,
      savingsAmount: savings,
      image: pkg.image,
      selectedDate: availableDates[0]?.date || 'Aug 11',
      selectedTime: '10:00 AM',
      hospitalName: pkg.hospitalName,
    });

    router.replace('/booking/checkout');
  }, [packageId, mode]);

  // Flexible Payment Mode: 'token' | 'full'
  const initialMode = mode === 'full' ? 'full' : 'token';
  const [paymentMode, setPaymentMode] = useState<'token' | 'full'>(initialMode);

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [showCouponOverlay, setShowCouponOverlay] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Price calculations
  const rawPrice = parseInt(pkg.price.replace(/[^0-9]/g, '')) || 24999;
  const discount = couponCode ? 2000 : 0;
  const onlineFullDiscount = paymentMode === 'full' ? 500 : 0;
  const netPackageTotal = rawPrice - discount - onlineFullDiscount;
  
  const tokenAmount = 499;
  const amountToPayNow = paymentMode === 'token' ? tokenAmount : netPackageTotal;

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
  };

  const handleConfirmPackageBooking = () => {
    setShowPaymentModal(true);
  };

  const executeStoreBooking = (paidNow: number) => {
    const bookingId = bookPackage({
      packageId: pkg.id,
      packageTitle: pkg.title,
      hospitalName: pkg.hospitalName,
      patientName: patientName || 'Patient',
      patientPhone: patientPhone || '9876543210',
      scheduledDate: selectedDate,
      scheduledTime: selectedSlot,
      paymentMode,
      totalAmount: netPackageTotal,
      amountPaid: paidNow,
      paymentStatus: 'paid',
    });

    router.replace({
      pathname: '/booking/success',
      params: { appointmentId: bookingId },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <SafeAreaView edges={['top']} style={[styles.headerBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Package Booking</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Package Summary & Details */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.packageHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{pkg.title}</Text>
              <View style={styles.hospitalRow}>
                <Building2 size={14} color="#6527BE" />
                <Text style={styles.hospitalText}>{pkg.hospitalName} • {pkg.hospitalLocation}</Text>
              </View>
            </View>
            <View style={styles.priceTagBox}>
              <Text style={styles.priceTagText}>{pkg.price}</Text>
              {pkg.originalPrice && <Text style={styles.originalPriceText}>{pkg.originalPrice}</Text>}
            </View>
          </View>
          
          <View style={styles.inclusionsBox}>
            {pkg.inclusions.slice(0, 3).map((inc, i) => (
              <View key={i} style={styles.inclusionItem}>
                <CheckCircle2 size={14} color="#00A981" />
                <Text style={[styles.inclusionText, { color: colors.text }]} numberOfLines={1}>{inc}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* 2. Choose Initial Consultation / Checkup Slot */}
        <Animated.View entering={FadeInDown.delay(130)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.sectionHeaderRow}>
            <Calendar size={18} color="#6527BE" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1st Consultation / Assessment Slot</Text>
          </View>
          <Text style={styles.sectionSub}>Select preferred date & time for your package kickoff visit</Text>
          
          {/* Dates Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dateCard,
                    isSelected
                      ? { backgroundColor: '#6527BE', borderColor: '#6527BE' }
                      : { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', borderColor: 'transparent' },
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[styles.dateDayName, { color: isSelected ? '#FFF' : '#888' }]}>{item.day}</Text>
                  <Text style={[styles.dateDayNum, { color: isSelected ? '#FFF' : colors.text }]}>{item.rawDate.getDate()}</Text>
                  <Text style={[styles.dateMonth, { color: isSelected ? '#DDD6FE' : '#888' }]}>{item.date.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time Slots */}
          <View style={styles.slotsRow}>
            {['09:30 AM', '11:00 AM', '02:30 PM', '05:00 PM'].map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotPill,
                    isSelected
                      ? { backgroundColor: isDark ? '#3B1D58' : '#F3E8FF', borderColor: '#6527BE' }
                      : { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', borderColor: 'transparent' },
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Clock size={12} color={isSelected ? '#6527BE' : '#888'} />
                  <Text style={[styles.slotText, { color: isSelected ? '#6527BE' : colors.text }]}>{slot}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* 3. Patient Details */}
        <Animated.View entering={FadeInDown.delay(160)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Details</Text>
          
          <View style={styles.bookingForContainer}>
            <TouchableOpacity 
              style={[styles.bookingForBtn, bookingFor === 'self' && styles.bookingForBtnActive]}
              onPress={() => setBookingFor('self')}
            >
              <User size={16} color={bookingFor === 'self' ? '#6527BE' : '#666'} />
              <Text style={[styles.bookingForText, bookingFor === 'self' && styles.bookingForTextActive]}>Self</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.bookingForBtn, bookingFor === 'family' && styles.bookingForBtnActive]}
              onPress={() => setBookingFor('family')}
            >
              <Users size={16} color={bookingFor === 'family' ? '#6527BE' : '#666'} />
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

        {/* 4. Flexible Payment Mode Selection */}
        <Animated.View entering={FadeInDown.delay(200)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.sectionHeaderRow}>
            <CreditCard size={18} color="#6527BE" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose How You Want to Pay</Text>
          </View>
          <Text style={styles.sectionSub}>Flexible healthcare payment options tailored for you</Text>

          {/* Option A: Token Advance (₹499) */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              paymentMode === 'token' && styles.paymentOptionCardSelected,
              { backgroundColor: isDark ? '#232328' : '#FAFAFA' },
            ]}
            onPress={() => setPaymentMode('token')}
          >
            <View style={styles.radioCircle}>
              {paymentMode === 'token' && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.optionTitleRow}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Reserve with ₹499 Token</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>MOST POPULAR</Text>
                </View>
              </View>
              <Text style={styles.optionDesc}>Pay ₹499 online deposit to lock package discount & slot. Pay balance at hospital desk.</Text>
            </View>
          </TouchableOpacity>

          {/* Option B: Pay Full Amount Online */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              paymentMode === 'full' && styles.paymentOptionCardSelected,
              { backgroundColor: isDark ? '#232328' : '#FAFAFA' },
            ]}
            onPress={() => setPaymentMode('full')}
          >
            <View style={styles.radioCircle}>
              {paymentMode === 'full' && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.optionTitleRow}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Pay Full Amount Online</Text>
                <View style={[styles.recommendedBadge, { backgroundColor: '#E6F6F2' }]}>
                  <Text style={[styles.recommendedText, { color: '#00A981' }]}>EXTRA ₹500 OFF</Text>
                </View>
              </View>
              <Text style={styles.optionDesc}>Complete 100% payment online now for instant cashback and priority doctor desk access.</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* 5. Offers & Coupons */}
        <Animated.View entering={FadeInDown.delay(240)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <TouchableOpacity 
            style={styles.couponBtn}
            onPress={() => setShowCouponOverlay(true)}
          >
            <View style={styles.couponLeft}>
              <View style={styles.couponIconBox}>
                <Tag size={20} color="#6527BE" />
              </View>
              <View>
                {couponCode ? (
                  <>
                    <Text style={[styles.couponTitle, { color: colors.text }]}>'{couponCode}' applied</Text>
                    <Text style={styles.couponSaved}>You saved ₹2,000</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.couponTitle, { color: colors.text }]}>Apply Coupon Code</Text>
                    <Text style={styles.couponSubtitle}>Check available discount offers</Text>
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

        {/* 6. Bill Details */}
        <Animated.View entering={FadeInDown.delay(280)} style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bill Breakup</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Package Price</Text>
            <Text style={[styles.billValue, { color: colors.text }]}>₹{rawPrice.toLocaleString()}</Text>
          </View>
          
          {couponCode && (
            <View style={styles.billRow}>
              <Text style={styles.billLabelDiscount}>Coupon Discount ({couponCode})</Text>
              <Text style={styles.billValueDiscount}>- ₹{discount.toLocaleString()}</Text>
            </View>
          )}

          {paymentMode === 'full' && (
            <View style={styles.billRow}>
              <Text style={styles.billLabelDiscount}>Full Payment Bonus</Text>
              <Text style={styles.billValueDiscount}>- ₹500</Text>
            </View>
          )}

          <View style={[styles.divider, { marginVertical: 12 }]} />
          
          <View style={styles.billRow}>
            <Text style={[styles.billTotalLabel, { color: colors.text }]}>Total Package Value</Text>
            <Text style={[styles.billTotalValue, { color: colors.text }]}>₹{netPackageTotal.toLocaleString()}</Text>
          </View>

          <View style={styles.paymentSummaryBox}>
            <Text style={styles.dueTodayLabel}>Due Online Today:</Text>
            <Text style={styles.dueTodayValue}>₹{amountToPayNow.toLocaleString()}</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.bottomTotalLabel}>Due Today</Text>
            <Text style={[styles.bottomTotalValue, { color: colors.text }]}>₹{amountToPayNow.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={handleConfirmPackageBooking}
          >
            <Text style={styles.payBtnText}>
              {paymentMode === 'token' ? 'Pay ₹499 & Reserve' : `Pay ₹${amountToPayNow.toLocaleString()} & Book`}
            </Text>
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
        amount={amountToPayNow}
        title={`${pkg.title} - ${paymentMode === 'token' ? 'Token Advance' : 'Full Payment'}`}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(payment) => {
          setShowPaymentModal(false);
          executeStoreBooking(amountToPayNow);
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  packageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hospitalText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priceTagBox: {
    alignItems: 'flex-end',
  },
  priceTagText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6527BE',
  },
  originalPriceText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  inclusionsBox: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inclusionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSub: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  datesRow: {
    gap: 8,
    marginBottom: 12,
  },
  dateCard: {
    width: 64,
    height: 70,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDayName: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateDayNum: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 1,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '600',
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingForContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    marginTop: 8,
  },
  bookingForBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bookingForBtnActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#6527BE',
  },
  bookingForText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  bookingForTextActive: {
    color: '#6527BE',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
    gap: 10,
  },
  paymentOptionCardSelected: {
    borderColor: '#6527BE',
    backgroundColor: '#F3E8FF20',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6527BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6527BE',
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 11.5,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  recommendedBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6527BE',
  },
  couponBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  couponSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  couponSaved: {
    fontSize: 12,
    color: '#00A981',
    fontWeight: '600',
  },
  removeCouponText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: '#666',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  billLabelDiscount: {
    fontSize: 13,
    color: '#00A981',
  },
  billValueDiscount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00A981',
  },
  billTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  billTotalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  dueTodayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6527BE',
  },
  dueTodayValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#6527BE',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#888',
  },
  bottomTotalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  payBtn: {
    backgroundColor: '#6527BE',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
