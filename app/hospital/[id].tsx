import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ShieldCheck, Star, MapPin, HeartPulse, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalFeatures from '@/components/HospitalFeatures';
import PromoBanner from '@/components/PromoBanner';
import HospitalServices from '@/components/HospitalServices';
import HospitalOverview from '@/components/hospital/HospitalOverview';
import HospitalDoctors from '@/components/hospital/HospitalDoctors';

// Mock Data
const HOSPITAL_DATA = {
  name: 'Max Super Speciality Hospital',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
  rating: '4.6',
  ratingsCount: '12.5K',
  type: 'Multi Speciality Hospital',
  distance: '3.1 km',
  location: 'Saket, New Delhi',
  emergency: '24x7 Emergency',
  fee: '800'
};

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Rohan Malhotra',
    speciality: 'Senior Cardiologist',
    degrees: 'MBBS, MD, DM (Cardiology)',
    rating: '4.8',
    reviews: '1.2K',
    experience: '10+ Yrs Exp.',
    hospital: 'Apollo Hospitals',
    location: 'Saket, New Delhi',
    price: '800',
    nextAvailable: 'Today, 11:30 AM',
    tagText: 'Highly Booked',
    tagType: 'fire',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200'
  },
  {
    id: 2,
    name: 'Dr. Neha Kapoor',
    speciality: 'Consultant Neurologist',
    degrees: 'MBBS, MD, DM (Neurology)',
    rating: '4.7',
    reviews: '950',
    experience: '8+ Yrs Exp.',
    hospital: 'Apollo Hospitals',
    location: 'Saket, New Delhi',
    price: '700',
    nextAvailable: 'Today, 12:00 PM',
    tagText: 'Fast Booking',
    tagType: 'zap',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200'
  },
  {
    id: 3,
    name: 'Dr. Aditya Verma',
    speciality: 'Orthopedic Surgeon',
    degrees: 'MBBS, MS (Ortho)',
    rating: '4.6',
    reviews: '870',
    experience: '12+ Yrs Exp.',
    hospital: 'Apollo Hospitals',
    location: 'Saket, New Delhi',
    price: '750',
    nextAvailable: 'Today, 02:30 PM',
    tagText: '95% Recommend',
    tagType: 'thumb',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200'
  }
];

export default function HospitalProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [likedDocs, setLikedDocs] = useState<{[key: number]: boolean}>({});
  const tabs = ['Overview', 'Experts', 'Packages'];

  const toggleDocLike = (docId: number) => {
    setLikedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrapper}>
          <Image source={{ uri: HOSPITAL_DATA.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.coverGradient}
          />
          <HospitalHeader 
            onBackPress={() => router.back()}
            onSearchPress={() => {}}
            onSharePress={() => {}}
          />
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>1/15</Text>
          </View>
        </View>

        <View style={[styles.topSection, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
          <View style={styles.mainInfoRow}>
            <View style={[styles.logoBox, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200' }} style={styles.logo} />
            </View>
            <View style={styles.mainInfoText}>
              <View style={styles.titleRow}>
                <Text style={[styles.hospitalName, { color: colors.text }]}>{HOSPITAL_DATA.name}</Text>
                <ShieldCheck size={20} color="#7C3AED" fill="#E0E7FF" style={{marginTop: 4}} />
              </View>
              <View style={styles.subInfoRow}>
                <Star size={12} color="#10B981" fill="#10B981" />
                <Text style={styles.ratingText}>{HOSPITAL_DATA.rating} ({HOSPITAL_DATA.ratingsCount})</Text>
                <Text style={styles.typeText}> •  {HOSPITAL_DATA.type}</Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#9CA3AF" />
                <Text style={styles.locationText}>{HOSPITAL_DATA.distance} • {HOSPITAL_DATA.location}</Text>
              </View>
            </View>
          </View>


          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive, { color: activeTab === tab ? '#7C3AED' : (isDark ? '#9CA3AF' : '#6B7280') }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.tabDivider, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]} />
        </View>

        {activeTab === 'Overview' && <HospitalOverview colors={colors} isDark={isDark} />}
        {activeTab === 'Experts' && (
          <HospitalDoctors 
            doctors={DOCTORS} 
            likedDocs={likedDocs} 
            toggleDocLike={toggleDocLike} 
            colors={colors} 
            isDark={isDark} 
          />
        )}
        {/* Packages Tab Placeholder */}
        {activeTab === 'Packages' && (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Health Packages Coming Soon</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 100,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  topSection: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  mainInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginRight: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  mainInfoText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
    lineHeight: 28,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  typeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  emergencyText: {
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#7C3AED',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '800',
  },
  tabDivider: {
    height: 1,
    width: '100%',
    marginTop: -1,
  },

});
