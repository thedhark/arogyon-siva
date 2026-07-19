import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, SlidersHorizontal, Grid, UserRound, Activity, Stethoscope, Building2, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

import TopFogOverlay from '@/components/TopFogOverlay';
import HomeHeader from '@/components/HomeHeader';
import PremiumSearchBar from '@/components/PremiumSearchBar';

import ServiceCard from '@/components/care/ServiceCard';
import NearbyProviderCard from '@/components/care/NearbyProviderCard';
import CareQuickFilters from '@/components/care/CareQuickFilters';
import CarePromoBanner from '@/components/care/CarePromoBanner';
import CareSupportBanner from '@/components/care/CareSupportBanner';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';

const POPULAR_SERVICES = [
  { id: '1', title: 'Consult a Doctor', image: MEDICAL_ILLUSTRATIONS.doctor, price: 'From INR 299' },
  { id: '2', title: 'Physiotherapy', image: MEDICAL_ILLUSTRATIONS.physiotherapy, price: 'From INR 499', route: '/care/service/physio' },
  { id: '3', title: 'Lab Tests', image: MEDICAL_ILLUSTRATIONS.labs, price: 'Up to 60% off' },
  { id: '4', title: 'MRI / Scans', image: MEDICAL_ILLUSTRATIONS.scans, price: 'Advanced Imaging' },
  { id: '5', title: 'Home Care', image: MEDICAL_ILLUSTRATIONS.homeCare, price: 'Verified staff' },
  { id: '6', title: 'Rehab Center', image: MEDICAL_ILLUSTRATIONS.rehab, price: 'Recovery plans' },
];

const NEARBY_PROVIDERS = [
  { id: '1', name: 'Motherhood Hospital', image: MEDICAL_ILLUSTRATIONS.hospital, rating: '4.6', distance: '2.1 km', badge: 'In 2 km' },
  { id: '2', name: 'Physio Active Clinic', image: MEDICAL_ILLUSTRATIONS.physiotherapy, rating: '4.8', distance: '1.3 km' },
  { id: '3', name: 'City X-Ray & Scan Centre', image: MEDICAL_ILLUSTRATIONS.scans, rating: '4.5', distance: '1.7 km' },
  { id: '4', name: 'Arogyon Home Care', image: MEDICAL_ILLUSTRATIONS.homeCare, rating: '4.7', distance: '2.4 km' },
];

const QUICK_FILTERS = [
  { id: 'all', label: 'All', icon: Grid, color: '#10B981', bg: '#D1FAE5' },
  { id: 'doctors', label: 'Doctors', icon: UserRound, color: '#6366F1', bg: '#E0E7FF' },
  { id: 'physio', label: 'Physio', icon: Activity, color: '#8B5CF6', bg: '#EDE9FE', route: '/care/service/physio' },
  { id: 'labs', label: 'Labs', icon: Stethoscope, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'hospitals', label: 'Hospitals', icon: Building2, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'more', label: 'More', icon: MoreHorizontal, color: '#6B7280', bg: '#F3F4F6' },
];

export default function CareScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <TopFogOverlay scrollY={scrollY} />
      
      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        bounces={false} 
        overScrollMode="never" 
        contentContainerStyle={styles.scrollContent}
      >
        
        <HomeHeader currentCity="Bangalore" avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" />

        <PremiumSearchBar />
        {/* Quick Filters */}
        <CareQuickFilters 
          filters={QUICK_FILTERS} 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          colors={colors} 
          isDark={isDark} 
        />

        {/* Promo Banner */}
        <CarePromoBanner />

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Services</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
            {POPULAR_SERVICES.map(service => (
              <ServiceCard 
                key={service.id}
                image={service.image}
                title={service.title}
                price={service.price}
                onPress={() => {
                  if (service.route) router.push(service.route as any);
                }}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </ScrollView>
        </View>

        {/* Nearby Care Providers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Care Providers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
            {NEARBY_PROVIDERS.map(provider => (
              <NearbyProviderCard 
                key={provider.id}
                image={provider.image}
                name={provider.name}
                rating={provider.rating}
                distance={provider.distance}
                badge={provider.badge}
                onPress={() => {}}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </ScrollView>
        </View>

        {/* Support Banner */}
        <CareSupportBanner colors={colors} isDark={isDark} />

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  horizontalScroll: {
    marginHorizontal: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: 12,
  },
});
