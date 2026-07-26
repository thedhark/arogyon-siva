import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MessageSquare, ShieldCheck, Check, Plus, Minus, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';

import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
import DoctorAbout from '@/components/doctor/DoctorAbout';

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
  
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [patientCount, setPatientCount] = useState(1);
  const [requestNotes, setRequestNotes] = useState('');

  if (!doctorData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Doctor not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const baseFee = parseInt(doctorData.fee) || 500;
  const totalFee = baseFee * patientCount;

  const handleBook = () => {
    router.push({ 
      pathname: '/booking/checkout', 
      params: { 
        type: 'In-Clinic', 
        doctorId: doctorData.id, 
        date: `${selectedDate.day}, ${selectedDate.date}`, 
        time: selectedTime,
        patients: patientCount.toString(),
        notes: requestNotes,
        fee: totalFee.toString()
      } 
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Doctor Profile Header */}
        <DoctorProfileHeader doctorData={doctorData} colors={colors} isDark={isDark} />

        {/* Doctor About Summary */}
        <View style={styles.sectionContainer}>
          <DoctorAbout doctorData={doctorData} colors={colors} isDark={isDark} />
        </View>

        {/* Slot Selection Card */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <View style={styles.cardHeader}>
            <Calendar size={18} color="#10B981" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Select Date & Time</Text>
          </View>

          {/* Date Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {DATES.map((item) => {
              const isSelected = selectedDate.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: isSelected ? '#10B981' : (isDark ? '#2B2B2B' : '#F3F4F6'),
                      borderColor: isSelected ? '#10B981' : 'transparent',
                    }
                  ]}
                  onPress={() => setSelectedDate(item)}
                >
                  <Text style={[styles.dateDay, { color: isSelected ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280') }]}>{item.day}</Text>
                  <Text style={[styles.dateText, { color: isSelected ? '#FFFFFF' : colors.text }]}>{item.date}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time Slots */}
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: isSelected ? '#ECFDF5' : (isDark ? '#2B2B2B' : '#F9FAFB'),
                      borderColor: isSelected ? '#10B981' : (isDark ? '#333' : '#E5E7EB'),
                    }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Clock size={12} color={isSelected ? '#10B981' : '#9CA3AF'} style={{ marginRight: 4 }} />
                  <Text style={[styles.timeText, { color: isSelected ? '#10B981' : colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Consultation Request Box (Matches Reference Image UI) */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <View style={styles.cardHeader}>
            <MessageSquare size={18} color="#10B981" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Add a consultation request (optional)</Text>
          </View>
          
          <Text style={styles.requestSubtext}>
            The doctor will try its best to fulfill your requests. However, medical decisions depend on clinical assessment.
          </Text>

          <TextInput
            style={[
              styles.notesInput, 
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB', 
                color: colors.text,
                borderColor: isDark ? '#3A3A3A' : '#E5E7EB'
              }
            ]}
            placeholder="e.g. Fever for 2 days, back pain or routine checkup"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            value={requestNotes}
            onChangeText={setRequestNotes}
          />
        </View>

      </ScrollView>

      {/* Sticky Bottom Action Bar (Inspired by Reference Image) */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#E5E7EB' }]}>
        {/* Quantity Stepper [- 1 +] */}
        <View style={[styles.stepperContainer, { borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <TouchableOpacity 
            style={styles.stepperBtn}
            onPress={() => setPatientCount(Math.max(1, patientCount - 1))}
          >
            <Minus size={16} color={patientCount > 1 ? '#EF4444' : '#9CA3AF'} />
          </TouchableOpacity>
          <Text style={[styles.stepperVal, { color: colors.text }]}>{patientCount}</Text>
          <TouchableOpacity 
            style={styles.stepperBtn}
            onPress={() => setPatientCount(patientCount + 1)}
          >
            <Plus size={16} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Book Visit ₹{totalFee}</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 10,
  },
  bookBtn: {
    flex: 1,
    backgroundColor: '#F43F5E', // Vibrant coral/red matching reference image action button
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

