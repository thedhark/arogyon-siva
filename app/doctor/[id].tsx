import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';

import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';

const DATES = [
  { id: '1', day: 'Today', date: 'Aug 14' },
  { id: '2', day: 'Tomorrow', date: 'Aug 15' },
  { id: '3', day: 'Wed', date: 'Aug 16' },
  { id: '4', day: 'Thu', date: 'Aug 17' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:30 AM', 
  '02:00 PM', '04:00 PM', '05:30 PM'
];

export default function DoctorProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const getDoctor = useBookingStore(state => state.getDoctor);
  const doctorData = getDoctor(id as string);
  
  const [consultType, setConsultType] = useState<'In-Clinic' | 'Video Consult'>('In-Clinic');
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!doctorData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Doctor not found.</Text>
      </View>
    );
  }

  const baseFee = parseFloat(doctorData.fee) || 699;
  const selectedService = doctorData.services?.find((s: any) => s.id === selectedServiceId);
  const servicePriceNum = selectedService ? parseFloat(selectedService.price.replace(/[^0-9.]/g, '')) || 0 : 0;
  const totalFee = baseFee + servicePriceNum;
  const originalFee = Math.round(totalFee * 2.5);

  const handleBook = () => {
    router.push({ 
      pathname: '/booking/checkout', 
      params: { 
        type: consultType, 
        doctorId: doctorData.id, 
        date: `${selectedDate.day}, ${selectedDate.date}`, 
        time: selectedTime,
        serviceId: selectedServiceId || '',
        notes: requestNotes,
      } 
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DoctorProfileHeader 
          doctorData={doctorData}
          colors={colors}
          isDark={isDark}
        />

        {/* Date & Time Slot Selector */}
        <View style={styles.sectionContainer}>
          <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
            <View style={styles.cardHeader}>
              <Calendar size={18} color="#10B981" />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Select Booking Date</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
              {DATES.map((item) => {
                const isSelected = selectedDate.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.dateChip,
                      {
                        borderColor: isSelected ? '#10B981' : (isDark ? '#333' : '#E5E7EB'),
                        backgroundColor: isSelected ? (isDark ? '#112D29' : '#ECFDF5') : 'transparent',
                      }
                    ]}
                    onPress={() => setSelectedDate(item)}
                  >
                    <Text style={[styles.dateDay, { color: isSelected ? '#10B981' : '#6B7280' }]}>{item.day}</Text>
                    <Text style={[styles.dateText, { color: isSelected ? '#10B981' : colors.text }]}>{item.date}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.cardHeader, { marginTop: 16 }]}>
              <Clock size={18} color="#10B981" />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Select Time Slot</Text>
            </View>

            <View style={styles.timeSlotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeChip,
                      {
                        borderColor: isSelected ? '#10B981' : (isDark ? '#333' : '#E5E7EB'),
                        backgroundColor: isSelected ? (isDark ? '#112D29' : '#ECFDF5') : 'transparent',
                      }
                    ]}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text style={[styles.timeText, { color: isSelected ? '#10B981' : colors.text }]}>{slot}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Symptoms / Notes Input */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB', marginBottom: 20 }]}>
          <View style={styles.cardHeader}>
            <MessageSquare size={18} color="#10B981" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Add Medical Symptoms / Note (Optional)</Text>
          </View>
          
          <TextInput
            style={[styles.notesInput, { color: colors.text, borderColor: isDark ? '#3A3A3A' : '#E5E7EB', backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB' }]}
            placeholder="Describe your health problem, past treatment or symptoms for the doctor..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            value={requestNotes}
            onChangeText={setRequestNotes}
          />
        </View>
      </ScrollView>

      {/* Sticky Booking Payment Action Bar matching exact user design */}
      <StickyBookingPaymentBar
        priceDropText="Price dropped by ₹167"
        price={totalFee}
        originalPrice={originalFee}
        discountText="60% Off"
        ctaText="Book Visit"
        ctaIcon="calendar"
        onPressCTA={handleBook}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  sectionContainer: {
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  datesRow: {
    gap: 10,
    paddingVertical: 8,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    borderWidth: 1,
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: '31%',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
  },
  requestSubtext: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  notesInput: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  bottomFixedContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 14,
    left: 14,
    right: 14,
  },
  coralCapsuleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F43F5E',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  capsuleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  capsuleAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  capsuleItemsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  capsuleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capsuleContinueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

