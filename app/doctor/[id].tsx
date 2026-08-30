import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { TRUSTED_DOCTORS } from '@/constants/trusted-doctors';
import { Fonts } from '@/constants/theme';
import { useScrollFooter } from '@/hooks/useScrollFooter';

import DoctorHeroCard from '@/components/doctor/DoctorHeroCard';
import DoctorSlotPicker, { DEFAULT_DATES, DateItem } from '@/components/doctor/DoctorSlotPicker';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';
import FloatingCartBar from '@/components/booking/FloatingCartBar';

export default function DoctorProfile() {
  const { id, slot } = useLocalSearchParams<{ id: string; slot?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const getDoctor = useBookingStore(state => state.getDoctor);
  const addCartItem = useBookingStore(state => state.addCartItem);

  // Universal Doctor Lookup: Store registry -> TRUSTED_DOCTORS -> fallback
  const doctorData = useMemo(() => {
    if (!id) return getDoctor('doc-rohan');

    const fromStore = getDoctor(id);
    if (fromStore) return fromStore;

    const fromTrusted = TRUSTED_DOCTORS.find(d => d.id === id);
    if (fromTrusted) {
      return {
        id: fromTrusted.id,
        name: fromTrusted.name,
        specialty: fromTrusted.specialty,
        speciality: fromTrusted.specialty,
        rating: parseFloat(fromTrusted.rating),
        reviews: fromTrusted.reviews ? parseInt(fromTrusted.reviews.replace(/[^0-9]/g, ''), 10) * 100 : 1200,
        experience: fromTrusted.experience || '10+ Years',
        location: fromTrusted.location || fromTrusted.hospital,
        hospital: fromTrusted.hospital,
        hospitalName: fromTrusted.hospital,
        patients: fromTrusted.patientsTreated,
        languages: fromTrusted.languages?.join(', ') || 'English, Hindi',
        about: fromTrusted.about || `${fromTrusted.name} is an experienced specialist with extensive expertise in clinical care and advanced treatment protocols.`,
        image: fromTrusted.image,
        fee: fromTrusted.fee ? fromTrusted.fee.toString() : '600',
        approvalRating: fromTrusted.rating ? `${Math.round(parseFloat(fromTrusted.rating) * 20)}%` : '97%',
      };
    }

    return getDoctor('doc-rohan') || Object.values(useBookingStore.getState().doctors)[0];
  }, [id, getDoctor]);

  const [selectedDate, setSelectedDate] = useState<DateItem>(DEFAULT_DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string>(slot || '11:30 AM');
  const [requestNotes, setRequestNotes] = useState('');

  const { isFooterVisible, scrollProps } = useScrollFooter({ threshold: 12, topThreshold: 30 });

  // Compute pricing
  const rawClinicFee = parseInt((doctorData?.fee || '600').replace(/[^0-9]/g, ''), 10) || 600;
  const clinicFee = rawClinicFee;
  const originalFee = Math.round(clinicFee * 1.35);

  const handleAddVisit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const consultTypeLabel = 'In-Clinic Visit';
    const doctorSpecialty = (doctorData as any)?.specialty || doctorData?.speciality || 'Specialist';

    addCartItem({
      type: 'visit',
      itemId: doctorData?.id || 'doc-rohan',
      title: doctorData?.name || 'Doctor Visit',
      subtitle: `${doctorSpecialty} • ${consultTypeLabel}`,
      price: clinicFee,
      originalPrice: originalFee,
      savingsAmount: originalFee - clinicFee,
      image: doctorData?.image || '',
      selectedDate: selectedDate.fullDate || `${selectedDate.day}, ${selectedDate.date}`,
      selectedTime: selectedTime,
      hospitalName: (doctorData as any)?.hospital || (doctorData as any)?.hospitalName || doctorData?.location || 'Dr. Rela Institute & Medical Centre',
      notes: requestNotes.trim() || undefined,
    });

    router.push('/booking/checkout');
  };

  const hospitalName = (doctorData as any)?.hospital || (doctorData as any)?.hospitalName || 'Dr. Rela Institute & Medical Centre';
  const hospitalLocation = (doctorData as any)?.location || (doctorData as any)?.hospitalLocation || 'Chromepet';

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {/* 1. Doctor Profile Hero & Approval Rating Card */}
        <DoctorHeroCard
          doctor={doctorData}
          colors={colors}
          isDark={isDark}
        />

        {/* 2. Book Clinic Visit Card (Hospital, Fee, Date Tabs, Time Slots, View All Slots) */}
        <DoctorSlotPicker
          hospitalName={hospitalName}
          hospitalLocation={hospitalLocation}
          clinicFee={clinicFee}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          isDark={isDark}
          colors={colors}
        />

        {/* 3. Add Symptoms or Note (Optional) */}
        <View style={styles.notesContainer}>
          <View
            style={[
              styles.notesCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.notesHeader}>
              <MessageSquare size={17} color="#2563EB" />
              <Text style={[styles.notesTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Add Symptoms or Note (Optional)
              </Text>
            </View>

            <TextInput
              style={[
                styles.notesInput,
                {
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                },
              ]}
              placeholder="Describe your symptoms, health problem, or medications..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={requestNotes}
              onChangeText={setRequestNotes}
            />
          </View>
        </View>
      </ScrollView>

      {/* 4. Sticky Booking Payment Action Bar */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹150"
        price={clinicFee}
        originalPrice={originalFee}
        discountText="33% Off"
        ctaText="ADD VISIT"
        ctaIcon="calendar"
        onPressCTA={handleAddVisit}
        visible={isFooterVisible}
      />

      <FloatingCartBar bottomOffset={80} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  notesContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  notesCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  notesInput: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    fontFamily: Fonts.regular,
  },
});
