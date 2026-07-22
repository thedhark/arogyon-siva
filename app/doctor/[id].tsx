import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
import DoctorStats from '@/components/doctor/DoctorStats';
import DoctorAbout from '@/components/doctor/DoctorAbout';
import { SlotSelectionBottomSheet } from '@/components/booking/SlotSelectionBottomSheet';

const TABS = ['About', 'Services', 'Reviews', 'Availability'];

export default function DoctorProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const getDoctor = useBookingStore(state => state.getDoctor);
  const doctorData = getDoctor(id as string);
  
  const [activeTab, setActiveTab] = useState('About');
  const [selectedSlot, setSelectedSlot] = useState({ date: 'Aug 14', time: '10:00 AM' });
  
  const slotSheetRef = useRef<BottomSheetModal>(null);

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

  const handleBook = () => {
    router.push({ 
      pathname: '/booking/checkout', 
      params: { type: 'In-Clinic', doctorId: doctorData.id, date: selectedSlot.date, time: selectedSlot.time } 
    });
  };

  const handleSlotConfirm = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    slotSheetRef.current?.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
        
        <DoctorProfileHeader doctorData={doctorData} colors={colors} isDark={isDark} />
        
        <DoctorStats doctorData={doctorData} isDark={isDark} />

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: isDark ? '#333' : '#F3F4F6' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[
                    styles.tabText, 
                    { color: isActive ? '#10B981' : colors.textMuted, fontWeight: isActive ? '700' : '500' }
                  ]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {activeTab === 'About' && (
          <DoctorAbout doctorData={doctorData} colors={colors} isDark={isDark} />
        )}
        {activeTab !== 'About' && (
          <View style={{ padding: 24 }}>
            <Text style={{ color: colors.textSecondary }}>{activeTab} content coming soon.</Text>
          </View>
        )}

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#F3F4F6' }]}>
        <View style={styles.bottomBarHeader}>
          <Text style={styles.nextAvailableLabel}>Selected Slot</Text>
          <TouchableOpacity onPress={() => slotSheetRef.current?.present()}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.nextAvailableTime, { color: colors.text }]}>
          {selectedSlot.date}, {selectedSlot.time}
        </Text>
        
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.bottomStatsRow}>
          <Text style={styles.consultationFee}>Consultation fee <Text style={{ fontWeight: '800' }}>₹{doctorData.fee}</Text></Text>
          <View style={styles.secureBooking}>
            <Text style={{ fontSize: 12 }}>🔒</Text>
            <Text style={styles.secureText}>Secure Booking</Text>
          </View>
        </View>
      </View>

      <SlotSelectionBottomSheet ref={slotSheetRef} onConfirm={handleSlotConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 220, // Extra space for the big bottom bar
  },
  tabsContainer: {
    borderBottomWidth: 1,
    marginTop: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nextAvailableLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  nextAvailableTime: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  bookBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultationFee: {
    fontSize: 12,
    color: '#4B5563',
  },
  secureBooking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  }
});
