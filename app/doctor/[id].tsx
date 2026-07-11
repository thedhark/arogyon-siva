import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
import DoctorStats from '@/components/doctor/DoctorStats';
import DoctorAbout from '@/components/doctor/DoctorAbout';

const DOCTOR_DATA = {
  id: 'physio-1',
  name: 'Dr. Arjun Mehta',
  verified: true,
  speciality: 'Sports Physiotherapist',
  experience: '7+ Years Experience',
  rating: '4.9',
  reviews: '256',
  location: 'Koramangala',
  distance: '1.2 km',
  patients: '5000+',
  languages: 'English, Hindi',
  about: 'Specialized in sports injuries, post-surgical rehab, back pain, and joint pain management. He helps patients recover better and move stronger.',
  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600',
  nextAvailable: 'Today, 10:00 AM',
  fee: '699',
  services: [
    { id: 1, name: 'Sports Injury Rehab', price: '₹699' },
    { id: 2, name: 'Back & Neck Pain', price: '₹599' },
    { id: 3, name: 'Post Surgery Rehab', price: '₹699' },
    { id: 4, name: 'Knee Pain Treatment', price: '₹599' },
  ]
};

const TABS = ['About', 'Services', 'Reviews', 'Availability'];

export default function DoctorProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('About');

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
        
        <DoctorProfileHeader doctorData={DOCTOR_DATA} colors={colors} isDark={isDark} />
        
        <DoctorStats doctorData={DOCTOR_DATA} isDark={isDark} />

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
          <DoctorAbout doctorData={DOCTOR_DATA} colors={colors} isDark={isDark} />
        )}

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDark ? '#333' : '#F3F4F6' }]}>
        <View style={styles.bottomBarHeader}>
          <Text style={styles.nextAvailableLabel}>Next Available</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.nextAvailableTime, { color: colors.text }]}>{DOCTOR_DATA.nextAvailable}</Text>
        
        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push({ pathname: '/booking/checkout', params: { type: 'In-Clinic', doctorId: id } })}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.bottomStatsRow}>
          <Text style={styles.consultationFee}>Consultation fee <Text style={{ fontWeight: '800' }}>₹{DOCTOR_DATA.fee}</Text></Text>
          <View style={styles.secureBooking}>
            <Text style={{ fontSize: 12 }}>🔒</Text>
            <Text style={styles.secureText}>Secure Booking</Text>
          </View>
        </View>
      </View>

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
