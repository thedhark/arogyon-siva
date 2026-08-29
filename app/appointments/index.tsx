import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Calendar,
  Receipt,
  Plus,
  CalendarPlus,
  Headphones,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useBookingStore, Appointment } from '@/hooks/useBookingStore';
import BookingHistoryCard from '@/components/booking/BookingHistoryCard';
import ArogyonSupportModal from '@/components/support/ArogyonSupportModal';
import BookingFeedbackModal from '@/components/booking/BookingFeedbackModal';
import PaymentInvoiceModal from '@/components/payments/PaymentInvoiceModal';
import RefundDetailsModal from '@/components/payments/RefundDetailsModal';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const appointments = useBookingStore((state) => state.appointments);
  const addCartItem = useBookingStore((state) => state.addCartItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedSupportBooking, setSelectedSupportBooking] = useState<Appointment | null>(null);
  const [feedbackBookingData, setFeedbackBookingData] = useState<{ booking: Appointment; rating: number } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Appointment | null>(null);
  const [selectedRefundAppointment, setSelectedRefundAppointment] = useState<Appointment | null>(null);

  const invoiceSheetRef = useRef<ActionBottomSheetRef>(null);

  // Tab Filtering & Search
  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return appointments.filter((app) => {
      // Tab match
      if (activeTab === 'upcoming' && app.status !== 'upcoming') return false;
      if (activeTab === 'completed' && app.status !== 'completed') return false;
      if (activeTab === 'cancelled' && app.status !== 'cancelled' && app.paymentStatus !== 'refunded') return false;

      // Query match
      if (query) {
        const docName = (app.doctorName || '').toLowerCase();
        const hospName = (app.hospitalName || '').toLowerCase();
        const spec = (app.speciality || '').toLowerCase();
        return docName.includes(query) || hospName.includes(query) || spec.includes(query);
      }

      return true;
    });
  }, [appointments, activeTab, searchQuery]);

  const handleReorder = (booking: Appointment) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    addCartItem({
      type: 'visit',
      itemId: booking.doctorId || 'doc-1',
      title: booking.doctorName,
      subtitle: booking.speciality,
      price: Number(booking.consultationFee || booking.fee || 800),
      image: booking.image,
      selectedDate: '26 Aug 2026',
      selectedTime: '10:00 AM',
      hospitalName: booking.hospitalName,
      assignedPatientName: booking.assignedPatientName || 'Kandala Sridhar',
    });
    router.push('/booking/checkout' as any);
  };

  const handleOpenSupport = (booking: Appointment) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedSupportBooking(booking);
  };

  return (
    <AnimatedScreen entrance="fade">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: isDark ? '#0B132B' : '#EDF4FC' }]}>
        {/* 1. Floating Header with Curves & Minimal Gap */}
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Your Bookings</Text>

          <TouchableOpacity
            style={[styles.receiptBtn, { backgroundColor: isDark ? '#27272A' : '#F8FAFC' }]}
            onPress={() => router.push('/profile/payments')}
            activeOpacity={0.7}
          >
            <Receipt size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* 2. Floating Search Bar (Screenshot 1: "Search by restaurant or dish") */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? '#162038' : '#FFFFFF',
              borderColor: isDark ? '#233252' : '#E0ECF8',
            },
          ]}
        >
          <Search size={18} color="#E11D48" style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by hospital, doctor or package"
            placeholderTextColor={isDark ? '#71717A' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={isDark ? '#CBD5E1' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        {/* 3. Category Filter Chips */}
        <View style={styles.tabChipsRow}>
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labelMap = {
              all: `All (${appointments.length})`,
              upcoming: `Upcoming (${appointments.filter((a) => a.status === 'upcoming').length})`,
              completed: 'Completed',
              cancelled: 'Cancelled',
            };

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabChip,
                  isActive
                    ? styles.tabChipActive
                    : [
                        styles.tabChipInactive,
                        {
                          backgroundColor: isDark ? '#162038' : '#FFFFFF',
                          borderColor: isDark ? '#233252' : '#E0ECF8',
                        },
                      ],
                ]}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setActiveTab(tab);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    {
                      color: isActive ? '#FFFFFF' : isDark ? '#CBD5E1' : '#475569',
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {labelMap[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Bookings List ScrollView */}
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={56} color="#E11D48" opacity={0.3} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No bookings found
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Book a consultation or health package with top specialists & hospitals.
              </Text>
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => router.push('/category/doctor')}
                activeOpacity={0.85}
              >
                <CalendarPlus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.bookNowBtnText}>Book Doctor Consultation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredBookings.map((booking, index) => (
              <Animated.View key={booking.id} entering={FadeInDown.delay(index * 60)}>
                <BookingHistoryCard
                  appointment={booking}
                  onReorderPress={handleReorder}
                  onSupportPress={handleOpenSupport}
                  onShareFeedbackPress={(appt, r) => setFeedbackBookingData({ booking: appt, rating: r })}
                  onTrackRefundPress={(appt) => setSelectedRefundAppointment(appt)}
                  onViewReceiptPress={(appt) => {
                    setSelectedInvoice(appt);
                    invoiceSheetRef.current?.present();
                  }}
                />
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Support Chat Modal (Screenshot 3) */}
        {selectedSupportBooking && (
          <ArogyonSupportModal
            visible={!!selectedSupportBooking}
            onClose={() => setSelectedSupportBooking(null)}
            bookingInfo={{
              id: selectedSupportBooking.id,
              doctorName: selectedSupportBooking.doctorName,
              hospitalName: selectedSupportBooking.hospitalName,
              speciality: selectedSupportBooking.speciality,
              patientName: selectedSupportBooking.assignedPatientName,
            }}
          />
        )}

        {/* Share More Feedback Modal (Screenshot 2) */}
        {feedbackBookingData && (
          <BookingFeedbackModal
            visible={!!feedbackBookingData}
            onClose={() => setFeedbackBookingData(null)}
            booking={feedbackBookingData.booking}
            initialRating={feedbackBookingData.rating}
          />
        )}

        {/* Digital Tax Invoice Bottom Sheet */}
        <ActionBottomSheet ref={invoiceSheetRef} snapPoints={['82%']}>
          <PaymentInvoiceModal
            appointment={selectedInvoice}
            onClose={() => invoiceSheetRef.current?.dismiss()}
          />
        </ActionBottomSheet>

        {/* Refund Details & ARN Tracking Modal */}
        <RefundDetailsModal
          visible={!!selectedRefundAppointment}
          appointment={selectedRefundAppointment}
          onClose={() => setSelectedRefundAppointment(null)}
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
  backButton: {
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
  receiptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  tabChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  tabChipActive: {
    backgroundColor: '#E11D48',
  },
  tabChipInactive: {
    borderWidth: 1,
  },
  tabChipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 16,
  },
  bookNowBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
