import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ShieldCheck, Star, MapPin, HeartPulse, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '@/hooks/useBookingStore';

import HospitalHeader from '@/components/HospitalHeader';
import HospitalOverview from '@/components/hospital/HospitalOverview';
import HospitalDoctors from '@/components/hospital/HospitalDoctors';
import HospitalPackages from '@/components/hospital/HospitalPackages';

export default function HospitalProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const getHospital = useBookingStore(state => state.getHospital);
  const getHospitalDoctors = useBookingStore(state => state.getHospitalDoctors);
  
  const hospitalData = getHospital(id as string);
  const doctors = getHospitalDoctors(id as string);

  const [activeTab, setActiveTab] = useState('Overview');
  const [likedDocs, setLikedDocs] = useState<{[key: string]: boolean}>({});
  const tabs = ['Overview', 'Doctors', 'Packages'];

  const toggleDocLike = (docId: any) => {
    setLikedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  if (!hospitalData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Hospital not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrapper}>
          <Image source={{ uri: hospitalData.image }} style={styles.coverImage} />
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
                <Text style={[styles.hospitalName, { color: colors.text }]}>{hospitalData.name}</Text>
              </View>
              <View style={styles.subInfoRow}>
                <Star size={12} color="#10B981" fill="#10B981" />
                <Text style={styles.ratingText}>{hospitalData.rating} ({hospitalData.ratingsCount})</Text>
                <Text style={styles.typeText}> •  {hospitalData.type}</Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#9CA3AF" />
                <Text style={styles.locationText}>{hospitalData.distance} • {hospitalData.location}</Text>
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

        {activeTab === 'Doctors' && (
          <HospitalDoctors 
            doctors={doctors} 
            likedDocs={likedDocs as any} 
            toggleDocLike={toggleDocLike} 
            colors={colors} 
            isDark={isDark} 
          />
        )}

        {activeTab === 'Packages' && (
          <HospitalPackages 
            colors={colors} 
            isDark={isDark} 
            hospitalName={hospitalData.name} 
          />
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
