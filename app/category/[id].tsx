import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryTabs from '@/components/category/CategoryTabs';
import RecommendationCard from '@/components/category/RecommendationCard';
import DoctorListItem from '@/components/category/DoctorListItem';
import HospitalListItem from '@/components/category/HospitalListItem';

const TABS = ['Recommended', 'Doctors', 'Hospitals', 'Packages'];

const MOCK_DATA = {
  recommended: [
    {
      id: 'r1',
      type: 'doctor' as const,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
      title: 'Dr. Arjun Reddy',
      subtitle: 'Orthopedic Specialist',
      experience: '12+ Years Exp.',
      rating: '4.8',
      reviews: '1.2K',
      price: '₹800',
      priceLabel: 'Consultation',
      buttonText: 'Book Now',
    },
    {
      id: 'r2',
      type: 'hospital' as const,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200',
      title: 'Manipal Hospital',
      subtitle: 'Orthopedic Care',
      distance: '2.1 km away',
      rating: '4.7',
      reviews: '2.5K',
      price: '₹600',
      priceLabel: 'Consultation from',
      buttonText: 'View Details',
    },
    {
      id: 'r3',
      type: 'package' as const,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
      title: 'Knee Treatment Care Package',
      subtitle: 'Includes Consultation, Physiotherapy & More',
      price: '₹18,999',
      originalPrice: '₹25,999',
      discount: 'Save 27%',
      buttonText: 'View Package',
    }
  ],
  doctors: [
    {
      id: 'd1',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200',
      name: 'Dr. Vivek Shetty',
      speciality: 'Orthopedic Specialist',
      rating: '4.7',
      reviews: '982',
      experience: '10+ Years Exp.',
      price: '₹700',
    },
    {
      id: 'd2',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200',
      name: 'Dr. Priya Sharma',
      speciality: 'Joint Replacement Surgeon',
      rating: '4.9',
      reviews: '1.5K',
      experience: '15+ Years Exp.',
      price: '₹1000',
    }
  ],
  hospitals: [
    {
      id: 'h1',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200',
      name: 'Manipal Hospital',
      speciality: 'Orthopedic Care',
      rating: '4.7',
      reviews: '2.5K',
      distance: '2.1 km',
      beds: '100+ Beds',
      care24x7: true,
    },
    {
      id: 'h2',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
      name: 'Apollo Hospitals',
      speciality: 'Orthopedic Care',
      rating: '4.6',
      reviews: '3.1K',
      distance: '3.4 km',
      beds: '120+ Beds',
      care24x7: true,
    },
    {
      id: 'h3',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=200',
      name: 'Fortis Hospital',
      speciality: 'Orthopedic Care',
      rating: '4.5',
      reviews: '1.8K',
      distance: '4.2 km',
      beds: '80+ Beds',
      care24x7: true,
    },
    {
      id: 'h4',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=200',
      name: 'Narayana Health',
      speciality: 'Orthopedic Care',
      rating: '4.4',
      reviews: '1.2K',
      distance: '5.6 km',
      beds: '100+ Beds',
      care24x7: true,
    }
  ]
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Recommended');

  const renderRecommended = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for you</Text>
          <Text style={styles.sectionSubtitle}>AI picks based on your condition</Text>
        </View>
        <View style={styles.bestMatchBadge}>
          <Text style={styles.bestMatchText}>Best Match</Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
        {MOCK_DATA.recommended.map((item) => (
          <RecommendationCard 
            key={item.id}
            {...item}
            onPress={() => {}}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </ScrollView>

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Orthopedic Doctors</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        {MOCK_DATA.doctors.map((doctor) => (
          <DoctorListItem 
            key={doctor.id}
            {...doctor}
            onPress={() => {}}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderHospitals = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Hospitals</Text>
          <Text style={styles.sectionSubtitle}>50+ hospitals found</Text>
        </View>
      </View>
      
      <View style={styles.listContainer}>
        {MOCK_DATA.hospitals.map((hospital) => (
          <HospitalListItem 
            key={hospital.id}
            {...hospital}
            onPress={() => {}}
            colors={colors}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );

  const renderPlaceholder = (title: string) => (
    <View style={styles.placeholderContainer}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>{title} coming soon</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FDFDFD' }}>
      <CategoryHeader 
        title="Knee Pain"
        subtitle="Find the best care for your knee pain"
        icon="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200"
        isDark={isDark}
        colors={colors}
      />
      
      <CategoryTabs 
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={colors}
      />
      
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.locationSelector}>
          <MapPin size={16} color={colors.text} />
          <Text style={[styles.locationText, { color: colors.text }]}>Bangalore, Karnataka</Text>
          <ChevronDown size={16} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.filterButton, { borderColor: isDark ? '#333' : '#E5E7EB' }]}>
          <SlidersHorizontal size={14} color="#6366F1" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Recommended' && renderRecommended()}
        {activeTab === 'Hospitals' && renderHospitals()}
        {activeTab === 'Doctors' && renderPlaceholder('Doctors List')}
        {activeTab === 'Packages' && renderPlaceholder('Care Packages')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  bestMatchBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bestMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  horizontalScroll: {
    marginHorizontal: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: 12,
  },
  listContainer: {
    gap: 0,
  },
  placeholderContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
