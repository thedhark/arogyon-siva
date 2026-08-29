import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { TRUSTED_DOCTORS } from '@/constants/trusted-doctors';
import { Fonts } from '@/constants/theme';
import { useScrollFooter } from '@/hooks/useScrollFooter';

import DoctorHeroCard from '@/components/doctor/DoctorHeroCard';
import DoctorQuickStats from '@/components/doctor/DoctorQuickStats';
import DoctorConsultModePicker from '@/components/doctor/DoctorConsultModePicker';
import DoctorSlotPicker, { DEFAULT_DATES, DateItem } from '@/components/doctor/DoctorSlotPicker';
import DoctorServicesList from '@/components/doctor/DoctorServicesList';
import DoctorReviewsSection from '@/components/doctor/DoctorReviewsSection';
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
        speciality: fromTrusted.specialty,
        rating: parseFloat(fromTrusted.rating),
        reviews: fromTrusted.reviews ? parseInt(fromTrusted.reviews.replace(/[^0-9]/g, '')) * 100 : 1200,
        experience: fromTrusted.experience || '10+ Years',
        location: fromTrusted.location || fromTrusted.hospital,
        hospital: fromTrusted.hospital,
        patients: fromTrusted.patientsTreated,
        languages: fromTrusted.languages?.join(', ') || 'English, Hindi',
        about: fromTrusted.about || `${fromTrusted.name} is a certified specialist at ${fromTrusted.hospital}.`,
        image: fromTrusted.image,
        fee: fromTrusted.fee.toString(),
        hospitalId: 'hosp-1',
        services: fromTrusted.services,
        tags: fromTrusted.tags,
      };
    }

    return getDoctor('doc-rohan') || Object.values(useBookingStore.getState().doctors)[0];
  }, [id, getDoctor]);

  const [selectedDate, setSelectedDate] = useState<DateItem>(DEFAULT_DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string>(slot || '10:15 AM');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState('');

  const { isFooterVisible, scrollProps } = useScrollFooter({ threshold: 12, topThreshold: 30 });

  // Compute pricing
  const rawClinicFee = parseInt((doctorData?.fee || '600').replace(/[^0-9]/g, '')) || 600;
  const clinicFee = rawClinicFee;
  const baseFee = clinicFee;

  const doctorServices = doctorData?.services || [];
  const selectedService = doctorServices.find((s: any) => s.id === selectedServiceId);
  const addonServicePrice = selectedService ? (parseInt(selectedService.price.replace(/[^0-9]/g, '')) || 0) : 0;
  
  const totalFee = baseFee + addonServicePrice;
  const originalFee = Math.round(totalFee * 1.5);
  const savings = originalFee - totalFee;

  const handleAddVisit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const consultTypeLabel = 'In-Clinic Visit';
    const doctorSpecialty = (doctorData as any)?.specialty || doctorData?.speciality || 'Specialist';

    addCartItem({
      type: 'visit',
      itemId: doctorData?.id || 'doc-rohan',
      title: doctorData?.name || 'Doctor Visit',
      subtitle: `${doctorSpecialty} • ${consultTypeLabel}`,
      price: totalFee,
      originalPrice: originalFee,
      savingsAmount: savings,
      image: doctorData?.image || '',
      selectedDate: selectedDate.fullDate || `${selectedDate.day}, ${selectedDate.date}`,
      selectedTime: selectedTime,
      hospitalName: (doctorData as any)?.hospital || doctorData?.location || 'Apollo Hospital',
    });

    router.push('/booking/checkout');
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#121214' : '#F9FAFB' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {/* 1. Hero Card with Verified Badges & About */}
        <DoctorHeroCard
          doctor={doctorData}
          colors={colors}
          isDark={isDark}
        />

        {/* 2. Quick Key Stats Bar */}
        <DoctorQuickStats
          doctor={doctorData}
          colors={colors}
          isDark={isDark}
        />

        {/* 3. In-Clinic Consultation Mode Banner */}
        <DoctorConsultModePicker
          clinicFee={clinicFee}
          hospitalName={(doctorData as any)?.hospital || doctorData?.location || 'Apollo Hospital'}
          isDark={isDark}
          colors={colors}
        />

        {/* 4. Interactive Date & Slot Selector */}
        <DoctorSlotPicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          isDark={isDark}
          colors={colors}
        />

        {/* 5. Areas of Expertise & Clinical Procedures */}
        <DoctorServicesList
          services={doctorServices}
          selectedServiceId={selectedServiceId}
          onSelectService={setSelectedServiceId}
          tags={(doctorData as any)?.tags || ['General Health', 'Specialist Care', 'Preventive Checkup']}
          languages={(doctorData as any)?.languages ? (typeof (doctorData as any).languages === 'string' ? (doctorData as any).languages.split(',').map((s: string) => s.trim()) : (doctorData as any).languages) : ['English', 'Hindi']}
          isDark={isDark}
          colors={colors}
        />

        {/* 6. Medical Symptoms / Notes Input */}
        <View style={styles.notesContainer}>
          <View
            style={[
              styles.notesCard,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
              },
            ]}
          >
            <View style={styles.notesHeader}>
              <MessageSquare size={17} color="#10B981" />
              <Text style={[styles.notesTitle, { color: colors.text }]}>
                Add Symptoms or Note (Optional)
              </Text>
            </View>

            <TextInput
              style={[
                styles.notesInput,
                {
                  color: colors.text,
                  borderColor: isDark ? '#33333F' : '#E5E7EB',
                  backgroundColor: isDark ? '#25252A' : '#F9FAFB',
                },
              ]}
              placeholder="Describe your health problem, existing medications, or symptoms..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={requestNotes}
              onChangeText={setRequestNotes}
            />
          </View>
        </View>

        {/* 7. Verified Patient Reviews */}
        <DoctorReviewsSection
          doctorRating={doctorData?.rating != null ? String(doctorData.rating) : '4.8'}
          reviewsCount={(doctorData as any)?.reviews || (doctorData as any)?.reviewsCount || '1.2K'}
          isDark={isDark}
          colors={colors}
        />
      </ScrollView>

      {/* 8. Sticky Booking Payment Action Bar */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹150"
        price={totalFee}
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
    marginTop: 14,
  },
  notesCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
