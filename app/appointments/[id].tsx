import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Headphones } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useBookingStore } from '@/hooks/useBookingStore';

import BookingStatusHeaderCard from '@/components/booking/BookingStatusHeaderCard';
import BookingHospitalInfoCard from '@/components/booking/BookingHospitalInfoCard';
import BookingItemsListCard from '@/components/booking/BookingItemsListCard';
import BookingBillSummaryCard from '@/components/booking/BookingBillSummaryCard';
import BookingSavingsBanner from '@/components/booking/BookingSavingsBanner';
import BookingCustomerInfoCard from '@/components/booking/BookingCustomerInfoCard';
import BookingStickyFooterBar from '@/components/booking/BookingStickyFooterBar';
import ArogyonSupportModal from '@/components/support/ArogyonSupportModal';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';
import BookingFeedbackModal from '@/components/booking/BookingFeedbackModal';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const getAppointment = useBookingStore((state) => state.getAppointment);
  const addCartItem = useBookingStore((state) => state.addCartItem);
  const appointment = getAppointment(id as string);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  if (!appointment) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          },
        ]}
      >
        <Text style={[styles.notFoundText, { color: colors.text }]}>
          Booking details not found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtnPill}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnPillText}>Back to Bookings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleReorder = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    addCartItem({
      type: 'visit',
      itemId: appointment.doctorId || 'doc-1',
      title: appointment.doctorName,
      subtitle: appointment.speciality,
      price: Number(appointment.consultationFee || appointment.fee || 800),
      image: appointment.image,
      selectedDate: '26 Aug 2026',
      selectedTime: '10:00 AM',
      hospitalName: appointment.hospitalName,
      assignedPatientName: appointment.assignedPatientName || 'Kandala Sridhar',
    });
    router.push('/booking/checkout' as any);
  };

  const handleOpenSupport = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowSupportModal(true);
  };

  const handleOpenInvoice = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowInvoiceModal(true);
  };

  return (
    <AnimatedScreen entrance="fade">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: isDark ? '#0B132B' : '#EDF4FC' }]}>
        {/* Floating Header with curves & minimal gap (Screenshot 2: "Order Details" + "Support") */}
        <View
          style={[
            styles.floatingHeader,
            {
              marginTop: insets.top + 6,
              backgroundColor: isDark ? '#162038' : '#FFFFFF',
              borderColor: isDark ? '#233252' : '#E0ECF8',
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>

          {/* Top-Right Support Button matching Screenshot 2 */}
          <TouchableOpacity
            style={styles.supportHeaderBtn}
            onPress={handleOpenSupport}
            activeOpacity={0.7}
          >
            <Headphones size={15} color="#E11D48" strokeWidth={2.4} />
            <Text style={styles.supportHeaderText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Order Details Body matching Screenshot 2 & 4 */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Status Header Card (Screenshot 2: "Order was delivered") */}
          <Animated.View entering={FadeInDown.delay(60)}>
            <BookingStatusHeaderCard
              status={appointment.status}
              confirmationStatus={appointment.confirmationStatus}
              paymentStatus={appointment.paymentStatus}
            />
          </Animated.View>

          {/* 2. Hospital / Provider Card (Screenshot 2: Restaurant Card with Call) */}
          <Animated.View entering={FadeInDown.delay(120)}>
            <BookingHospitalInfoCard appointment={appointment} />
          </Animated.View>

          {/* 3. Booked Items Breakdown (Screenshot 2: Item list with veg/care icon) */}
          <Animated.View entering={FadeInDown.delay(180)}>
            <BookingItemsListCard appointment={appointment} />
          </Animated.View>

          {/* 4. Bill Summary Card (Screenshot 2: Bill Summary with Download icon) */}
          <Animated.View entering={FadeInDown.delay(240)}>
            <BookingBillSummaryCard
              appointment={appointment}
              onInvoicePress={handleOpenInvoice}
            />
          </Animated.View>

          {/* 5. Savings Wave Banner (Screenshot 4: "You saved ₹88.00 on this order!") */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <BookingSavingsBanner savingsAmount={Number(appointment.discount || 155)} />
          </Animated.View>

          {/* 6. Customer & Address Details Card (Screenshot 4: Customer card) */}
          <Animated.View entering={FadeInDown.delay(360)}>
            <BookingCustomerInfoCard appointment={appointment} />
          </Animated.View>
        </ScrollView>

        {/* 7. Bottom Floating Sticky Bar: Reorder & Invoice (Screenshot 2 & 4) */}
        <BookingStickyFooterBar
          onReorderPress={handleReorder}
          onInvoicePress={handleOpenInvoice}
        />

        {/* Arogyon Support In-App Chat Modal (Screenshot 3) */}
        <ArogyonSupportModal
          visible={showSupportModal}
          onClose={() => setShowSupportModal(false)}
          bookingInfo={{
            id: appointment.id,
            doctorName: appointment.doctorName,
            hospitalName: appointment.hospitalName,
            speciality: appointment.speciality,
            patientName: appointment.assignedPatientName,
          }}
        />

        {/* Tax Invoice Modal */}
        <BookingInvoiceModal
          visible={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          booking={appointment}
        />

        {/* Share Feedback Modal */}
        <BookingFeedbackModal
          visible={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          booking={appointment}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    flex: 1,
    marginLeft: 12,
  },
  supportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  supportHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: '#E11D48',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 24,
  },
  notFoundText: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    marginBottom: 16,
  },
  backBtnPill: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backBtnPillText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
